<template>
  玩家{{ role }}
  <div :class="['board', {disable}]">
    <div @click="handleClick(index)" v-for="(i, index) in pattern" class="cell">
      {{ i === 1 ? "❎" : i === 2 ? "⭕️" : "" }}
    </div>
  </div>
  <button @click="handleRestart">restart</button>
</template>

<style lang="scss" scoped>
.board {
  width: 300px;
  height: 300px;
  display: flex;
  flex-wrap: wrap;
  user-select: none;
  font-size: 30px;
  .cell {
    width: 98px;
    height: 98px;
    border: 1px solid #fff;
    background-color: #dedddd;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.disable {
  pointer-events: none;
}
</style>

<script lang="ts">
import { ref, watchEffect, onMounted, reactive, nextTick } from "vue";
export default {
  name: "Tic",
  setup() {
    const role = ref(1);
    const disable = ref(false);
    const pattern = reactive([
      0, 0, 0,
      0, 2, 0,
      0, 0, 0]);

    function checkWin(pattern, role, count = 3) {
      /**
       * 这个应该仅仅作为胜负检测, 不应该将will的逻辑牵扯进来
       */
      let downslope = 0;
      let upslope = 0;
      for (let i = 0; i < pattern.length / 3; i++) {
        let row = 0;
        let col = 0;
        for (let j = 0; j < 3; j++) {
          if (pattern[i * 3 + j] === role) {
            /**
             * 行检测
             */
            row++;
          } else if (pattern[i * 3 + j] !== 0) {
            row--;
          }
          if (pattern[i + j * 3] === role) {
            /**
             * 列检测
             */
            col++;
          } else if (pattern[i + j * 3] !== 0) {
            col--;
          }
          if (i === j) {
            if (pattern[i * 3 + j] === role) {
              downslope++;
            } else if (pattern[i * 3 + j] !== 0) {
              downslope--;
            }
          }
          if (i + j === 2) {
            if (pattern[i * 3 + j] === role) {
              upslope++;
            } else if (pattern[i * 3 + j] !== 0) {
              upslope--;
            }
          }
        }
        if (row === count || col === count || downslope === count || upslope === count ) return true;
      }
      return false;
    }

    function findWillWillPoint(pattern, role) {
      /**
       * 找到将要获胜的点 可能有多个点
       */
      let point: { x: number, y: number }[] = [];
      let downslope = 0;
      let upslope = 0;
      for (let i = 0; i < pattern.length / 3; i++) {
        let row = 0;
        let col = 0;
        for (let j = 0; j < 3; j++) {
          if (pattern[i * 3 + j] === role) {
            /**
             * 行检测
             */
            row++;
          } else if (pattern[i * 3 + j] !== 0) {
            row--;
          } else if (row === 2) {
            point.push({
              x: i,
              y: j
            })
          }
          if (pattern[i + j * 3] === role) {
            /**
             * 列检测
             */
            col++;
          } else if (pattern[i + j * 3] !== 0) {
            col--;
          } else if (col === 2) {
            point.push({
              x: j,
              y: i
            })
          }
          if (i === j) {
            if (pattern[i * 3 + j] === role) {
              downslope++;
            } else if (pattern[i * 3 + j] !== 0) {
              downslope--;
            } else if (downslope === 2) {
              point.push({
                x: i,
                y: j
              })
            }
          }
          if (i + j === 2) {
            if (pattern[i * 3 + j] === role) {
              upslope++;
            } else if (pattern[i * 3 + j] !== 0) {
              upslope--;
            } else if (upslope === 2) {
              point.push({
                x: i,
                y: j
              })
            }
          }
        }
      }
      return point.length ? point : null;
    }

    enum Result {
      Win = 1,
      Draw = 0,
      Lose = -1
    }

    function bestChoice(pattern, role): {
      result: Result;
      point: null | {
        x: number;
        y: number;
      }
    } {
      pattern = [...pattern]
      const willWinPoint = findWillWillPoint(pattern, role);
      if (willWinPoint) return {
        result: Result.Win,
        point: willWinPoint[0] // 虽然这里可能是有多个点, 直接取第一个点即可
      };
      /**
       * 如果找不到可以直接获胜的点
       * 那么寻找当前角色走后, 另一个角色的最差结果
       */
      let result = -2;
      let point = null;
      for (let i = 0; i < pattern.length / 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (pattern[i * 3 + j] !== 0) continue;
          /** 
           * 假设走的是当前点
           */ 
          pattern[i * 3 + j] = role;
          const otherResult = bestChoice(pattern, [2, 1][role - 1]).result;
          /**
           * 对方的结果是输 我才会是赢
           */
          if (-otherResult > result) {
            result = -otherResult
            point = {
              x: i,
              y: j
            }
          }
        }
      }
      return {
        point,
        result: point ? result : 0,
      }
    }

    function handleClick(i) {
      if (pattern[i] !== 0) return;
      pattern[i] = role.value;
      if (checkWin(pattern, role.value)) {
        /**
         * check win
         */
        disable.value = true;
        console.log(`玩家${role.value}赢了！`)
      } else {
        role.value = [2, 1][role.value - 1];
        if(checkWin(pattern, role.value, 2)) {
          /**
           * will win
           */
          console.log(`玩家${role.value}将要赢了！`)
        }
        const best = bestChoice(pattern, role.value);
        console.log(role.value, best)
        if (best.point) pattern[best.point.x * 3 + best.point.y] = role.value;
        if (checkWin(pattern, role.value)) {
          /**
           * check win
           */
          disable.value = true;
          console.log(`玩家${role.value}赢了！`)
        }
        role.value = [2, 1][role.value - 1];
      }
    }

    function handleRestart() {
      disable.value = false;
      role.value = 1;
      Object.assign(pattern, [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
      ]);
    }

    onMounted(() => {
      console.log(role.value, bestChoice(pattern, role.value))
    })

    return {
      pattern,
      role,
      disable,
      handleClick,
      handleRestart,
    };
  },
};
</script>
