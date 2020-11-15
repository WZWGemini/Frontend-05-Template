### 图灵完备性
设计一门计算机语言 最基本需要满足图灵完备。

图灵完备性是针对一套数据操作而言的概念，数据操作可以是语言也可以是某些指令集，这套规则可以实现图灵机里面的全部功能时则 说明是图灵完备。

### 动态语言与静态语言
#### 静态语言(强类型)
在编译阶段变量的数据类型是可以确定的。eg：c、c++
#### 动态语言(弱类型语言)
在编译阶段变量的数据类型是可以不确定的。也就是在运行时 变量的类型是可能会变化的。 eg: js.

> 文稿中的说明 强类型： 无隐式转换 弱类型： 有隐式转换  
个人认为是不完全正确的，弱类型语言就算没有隐式转换，只有直接的类型转换 难道就不是弱类型了吗？

### 终结符与非终结符
#### 终结符
终结符是一个形式语言的基本符号。就是说，它们能在一个形式语法的推导规则的输入或输出字符串存在，而且它们不能被分解成更小的单位。确切地说，一个语法的规则不能改变终结符。

#### 非终结符
非终结符是可以被取代的符号。一个形式文法中必须有一个起始符号；这个起始符号属于非终结符的集合。

### JS类型
1. Number
2. String
3. Boolean
4. Undefined(建议采用void获取, 因为undefined是变量可以被改变)
5. Null
6. Object
7. Symbol

#### Number(IEE754规范 双精度浮点数)
格式：符号位(1位)+指数位(11位)+尾数位(52位)

符号位： 0代表正数，1代表负数

##### 数字语法
JavaScript中的数字常量一般用十进制表示。  

例如：var a = 42; var b = 42.3;  

数字前面的0可以省略：var a = 0.42; var b = .42;  

小数点后小数部分最后面的0也可以省略：var a = 42.0; var b = 42.;

特别大和特别小的数字默认用指数格式显示，与toExponential()函数的输出结果相同。

例如：var a = 5E10; 
a;// 50000000000
a.toExponential();  // "5e+10"

var b = a * a; b;// 2.5e+21 

var c = 1 / a; c;// 2e-11

##### 当前的JavaScript版本都支持这些格式：
1. 0xf3; // 243的十六进制
2. 0363; // 243的八进制从ES6开始，严格模式（strict mode）不再支持0363八进制格式。0363格式在非严格模式（non-strict mode）中仍然受支持，但是考虑到将来的兼容性，最好不要再使用（我们现在使用的应该是严格模式）。
4. 0o363; // 243的八进制
4. 0O363; // 同上
5. 0b11110011; // 243的二进制
6. 0B11110011; // 同上

考虑到代码的易读性，不推荐使用0O363格式，因为0和大写字母O在一起容易混淆。建议尽量使用小写的0x、0b和0o


##### 特殊的数字
1. 不是数字的数字NAN  
NaN是一个“警戒值”（sentinel value，有特殊用途的常规值），用于指出数字类型中的错误情况，即“执行数学运算没有成功，这是失败后返回的结果”。
2. 无穷数


### 面向对象
基本原则：对象的行为应该是改变此对象的状态。

### JS中的Object (属性是无序的，属性的键是字符串 or Symbol)
> 对象构造
> 1. 对象中的属性  
> 每一个属性都会有：属性标签及get/set方法  
> **属性标签**
>    * writable(是否可写)
>    * enumerable(可否被枚举)
>    * configurable(是否可以配置，若为false，则不能被delete)
>    * value
> 2. 原型  
> prototype对象属性的指向即为该对象的原型  
> 3. class 标签 ：表示 该对象属于哪个种类  
> 4. extensible 标签 ： 表示该对象是否允许继续增加新的属性  
>
> ==创建对象的方式==
> 1. 对象字面量：  
eg: var obj = {x:1}  
> 2. 使用new运算符  
eg: function f () {} ; new f ();
> 3. 使用Object.create()  
eg : var obj = Object.create({x:1}); obj.x // 1  
这种方式所产生的原型链  
![](http://ww1.sinaimg.cn/large/9da83df8gy1fjqew11w2qj20t807hq5a.jpg)  
>
> ==属性操作==
> 1. 属性的读写  
eg : var obj = {x:1}  
obj.x // 1
obj['x'] //1  
obj.x = 2  
obj['x'] = 2
> 2. 属性删除 (delete)  
eg: var obj = {x:1}  
delete obj.x  // true  
obj.x // undefined  
注意：delete的返回值为true时，并不代表删除生效了，只能代表 该属性不存在了，因为删除不存在的属性，也会返回true  
> 3. 属性的标签权限  
获取对象的某个属性的所有标签  
Object.getOwnPropertyDescriptor(对象名,'属性名')  
>    ```
>    var a = {x:1}
>    Object.getOwnPropertyDescriptor(a,'x')
>    {value: 1, writable: true, enumerable: true,
>    configurable: true}
>    或者使用getOwnPropertyDescriptors(对象名)，获取所有的属性的标签
>    ```
> 4. 属性的创建  
eg:  
obj.y = 1;obj.z = 2;  
上述创建方式，其属性的所有标签都是true  
即：writable,enumerable,configurable 都为true
==Object.defineProperty(obj,'v',{value:1000})==  
这样创建出来的writable,enumerable,configurable 都为false  
除非：Object.defineProperty(obj,'v'{enumerable:true,value:1000})进行特定指定  
还可以使用getter/setter方法定义
> 5. 属性检测  
![](http://ww1.sinaimg.cn/large/9da83df8gy1fjqfshnkanj20oy0g00xr.jpg)
> 6. 属性枚举  
![](http://ww1.sinaimg.cn/large/9da83df8gy1fjqgepikuqj20vv0grafq.jpg)
> 7. 属性getter/setter方法
>>```
>> var man = {  
>>    name: 'gemini',
>>    weibo: 'fate',
>>    get age() {
>>      return new Date().getFullYear()-1995
>>    },
>>    set age() {
>>      console.log('age can\'t be set')
>>    }
>>    console.log(man.age) // 22
>>    man.age = 100 // Age can't be set
>>    console.log(man.age) // 22
>>}
>>  当访问man.age时，会调用get方法，返回22，当对man.age赋值时，会调用set方法
> 8. 属性标签(属性级的权限设置)  
方法：  
Object.getOwnPropertyDescriptor(对象名，‘属性值’)  // 获取单个属性的所有属性标签，该方法返回值为对象  
Object.getOwnPropertyDesciptors(对象名)  
使用Object.defineProperty(对象名，‘属性名’{属性标签及值})/重设属性或创建属性  
Object.defineProperties(对象名，{属性名：{属性标签及值}})  
![](http://ww1.sinaimg.cn/large/9da83df8gy1fjvqcfm3rcj211k0knk35.jpg)
> 9. 对象标签 
>>标签：\_\_proto\_\_   class  extensible(是否可扩展)  
>> class 标签没有一个直接的方式查看，可以通过Object.prototype.toString.call(对象名)查看class  
可以通过Object.isExtensible(对象名)检查是否可扩展；一般都可以扩展  
若想修改为不可扩展，调用Object.preventExtensible(对象名)  
再进行查看就可以发现返回结果变为了false；当变为false后，再对 对象进行添加属性，会发现无法添加  
Object.seal(对象名)  将所有属性的configurable设置为false  
再使用Object.isSealed(对象名) // true  
Object.freeze(对象名)  将所有属性的writable 设置为false  
再使用Object.isFrozen(对象名) // true  
> 10. 对象序列化(JSON.string(对象名))  
但在使用的过程中，如果对象中有属性的值为undefined，那么序列化后，该属性是不会出现在序列化的字符串中  
如果属性的值为NaN或着Infinity，则会被转换为null  
如果属性的值为时间(new Date())，则会被转换为UTC的时间格式  
JSON.parse()  
==序列化自定义==
![](http://ww1.sinaimg.cn/large/9da83df8gy1fjvu2nbk3dj20qt0fkju6.jpg)
> 11. 对象方法  
JS中使用运算符时，会有同时调用一些方法进行隐式转换  
eg:
>>```
>>var obj ={x:1,y:2}
>>obj.toString() // "[object Object]"
>>重写obj的toString方法
>>obj.toString = function () {
>>  return this.x + this.y
>>}
>>"result" + obj // result 3  ; 在这里string类型与Object类型使用 + 运算符进行连接，会触发隐式调用toString方法，由于toString被我们改写了，所有obj.toString()返回的为3
>>但是当对象的valueOf方法，存在时，且返回的类型不未对象，那么在触发隐式转换时，会先尝试调用valueOf方法。
>>```
>> toString：  
>> valueOf  
>> toJSON
