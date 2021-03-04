#vue-notes

## `v-if` 和 `v-for` 哪个优先级更高?
- `v-for` 优先级高于 `v-if`
- 同时使用 `v-for` 和 `v-if`, 生成的渲染函数会先执行循环，在循环里执行if判断，因此即便只渲染列表的一小部分，也得遍历整个列表
    1.如下html：
    ```html
    <ul>
        <li
            v-for="user in users"
            v-if="user.isActive"
            :key="user.id"
        >
            {{ user.name }}
        </li>
    </ul>
    ```
    会执行如下运算: 
    ```js
    this.users.map(function (user) {
        if (user.isActive) {
            return user.name
        }
    })
    ```
---

## `key` 的作用
- `key` 的作用是为了优化 `patch` 性能，更高效的更新虚拟dom
- `patch` 过程中判断2个节点是否相同时 `key` 是必要条件之一。尤其在渲染列表时，如果没有 `key` 作为唯一标识，`patch` 过程中会认为比较的每两个节点都是同一个，影响 `patch` 的性能，带来频繁更新。

---

## 双向绑定极其原理
- vue中双向绑定只 `v-model` 指令。`v-model` 实际上是 `v-bind:value` 和 `v-on:input` 的语法糖
- 使用 `v-model` 可减少大量用于更新数据的事件代码，提高代码可读性？
- 自定义组件使用 `v-model`
    ```js
    {
        model: {
            prop: 'value', // v-bind
            event: 'change' // v-on
        }
    }
    ```
- vue3中，`v-model` 默认使用 `modelValue` 作为 prop 和 `update:modelValue` 作为事件，可以通过向`v-model` 传递参数来修改这些名称，如
    ```html
    <my-component v-model:foo="bar"></my-component>
    ```
    这里，子组件将需要一个 `foo` prop 并发出 `update:foo` 要同步的事件：
    ```js
    const app = createApp({})
    app.component('my-component', {
        props: {
            foo: String,
        },
        template: `
            <input
                type='text'
                :value="foo"
                @input="$emit('update:foo', $event.target.value)">
            </input>
            `
    })

    ```
---
## diff算法
- diff算法主要是对比虚拟dom，在vue里指 `patch` 过程，将变化的地方转为DOM操作
- vue1没有 `patch`，因为vue1每个依赖都有专门的 `watcher` 负责，这也导致了性能瓶颈。vue2调整策略，每个组件只有1个 `watcher`，降低 `watcher` 粒度，并通过 `patch` 保证准确更新
- `patch` 过程遵循深度优先、同层比较的策略；两个节点之间比较时，如果它们拥有子节点，会先比较子节点；比较两组子节点时，会假设头尾节点可能相同先做尝试，没有找到相同节点后才按照通用方式遍历查找；查找结束再按情况处理剩下的节点；借助key通常可以非常精确找到相同节点，因此整个 `patch` 过程非常高效

---

## vue组件通信方式
- `props`; `$emit/$on`; `$children/$parent`; `$attrs/$listeners`; `ref`; `$root`; `eventbus`; `vuex`
- 根据组件关系分类
    - 父子
        - props
        - $emit/$on
        - $parent/$children
        - ref
        - $attrs/$listeners
    - 兄弟
        - vuex
        - $parent
        - eventbus
    - 跨层级
        - provide/inject
        - $root
        - eventbut
        - vuex

---

## vuex的理解
- vue专用的状态管理库；以全局方式集中管理应用的状态，保证状态变更的可预测性
- vuex主要解决了多组件之间状态共享的难题
- ~
    - `state`: 保存全局状态的对象
    - `mutation`: 用于修改状态
    - `actio`n: commit mutation，提交修改状态，支持异步
    - `module`: 组织拆分的子模块
- vuex管理的数据是响应式的，通过vue将 `state` 作为 `data` 处理，从而在状态改变时更新渲染

---

## vue-router中如何保护路由？
- 导航守卫 `beforeRouterEnter/beforeEach`
    - 若权限不通过返回 `next(false)` 保护路由
- 触发顺序
    - 导航被触发。
    - 在失活的组件里调用离开守卫。
    - 调用全局的 `beforeEach` 守卫。
    - 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
    - 在路由配置里调用 `beforeEnter`。
    - 解析异步路由组件。
    - 在被激活的组件里调用 `beforeRouteEnter`。
    - 调用全局的 `beforeResolve` 守卫 (2.5+)。
    - 导航被确认。
    - 调用全局的 `afterEach` 钩子。
    - 触发 DOM 更新。
    - 用创建好的实例调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数。

---

## vue 使用优化
- 路由懒加载
    ```js
    const router = new VueRouter({
        routes: [
            { path: '/foo', component: () => import('./Foo.vue') }
        ]
    })
    ```
- `keep-alive` 缓存页面
    ```html
        <template>
            <div id="app">
                <keep-alive>
                <router-view/>
                </keep-alive>
            </div>
        </template>
    ```
- 使用 `v-show` 复用 Dom
- 避免 `v-for` 和 `v-if` 同时使用，当需要过滤时使用计算属性替代
- 长列表性能优化*
    - 如果列表数据仅作展示用，则不需要相应式
    ```js
        export default {
            data: () => ({
                users: []
            }),
            async created() {
                const users = await axios.get("/api/users");
                this.users = Object.freeze(users);//被冻结的对象无法做任何修改
            }
        };
    ```
    - 如果是大数据长列表，建议采用虚拟滚动
- 事件销毁
    Vue 组件销毁时，会自动解绑它的全部指令及事件监听器，但是仅限于组件本身的事件。
    组件内设置的定时器需要手动销毁
    ```js
        created() {
            this.timer = setInterval(this.refresh, 2000)
            },
        beforeDestroy() {
            clearInterval(this.timer)
        }
    ```
- 第三方按需引入
- 图片懒加载
- 无状态的组件设置为函数值组件
- 子组件分割
- 变量本地化
    ```js
    import { heavy } from '@/utils'

    export default {
    props: ['start'],
    computed: {
        base () { return 42 },
        result () {
        const base = this.base // 不要频繁引用this.base
        let result = this.start
        for (let i = 0; i < 1000; i++) {
            result += heavy(base)
        }
        return result
        }
    }
    ```

---

## nextTick 及其原理
- 定义
    - `Vue.nextTick( [callback, context] )`
    在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
    ```js
        // 修改数据
        vm.msg = 'Hello'
        // DOM 还没有更新
        Vue.nextTick(function () {
        // DOM 更新了
        })
    ```
    由于Vue的异步更新策略导致数据的修改不会立刻体现在dom上，而是在下一次 `event-loop` 才更新dom。因此如果想要立刻获取更新后的dom状态，就需要用这个方法。
- Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。`nextTick` 方法会在队列中加入一个回调函数，确保该函数在前面的dom操作完成后才调用。
    - vue在内部对异步队列尝试使用原生的 `promise.then`、`MutationObserver` 和 `setImmediate`。如果执行环境不支持，则采用 `setTimeout(fn, 0)` 替代
    - 源码中，修改一个数据，组件的对应 `watcher` 会尝试入队：
        ```js
            queue.push(watcher)
        ```
        并使用nextTick方法添加一个 `flushSchedulerQueue` 回调：
        ```js
            nextTick.push(flushSchedulerQueue)
        ```
        `flushSchedulerQueue` 被加入 `callbacks` 数组
        ```js
            callbacks.push(() => {
                if (cb) {
                    try {
                        cb.call(ctx) // cb就是加入的回调
                    } catch (e) {
                        handleError(e, ctx, 'nextTick')
                    }
                } 
            })
        ```
        然后以异步的方式启动：
        ```js
            if (!pending) {
                pending = true
                timerFunc()
            }
        ```
        `timerFunc` 的异步主要利用上述的三种方式实现
        ```js
            let timerFunc

            if (typeof Promise !== 'undefined' && isNative(Promise)) {
                const p = Promise.resolve()
                // timerFunc利用p.then向微任务队列添加一个flushCallbacks
                // 会异步调用flushCallbacks
                timerFunc = () => {
                    p.then(flushCallbacks)
                }
                isUsingMicroTask = true
            }
        ```
        `flushCallbacks` 遍历 `callbacks`, 执行里面所有的回调
        ```js
            function flushCallbacks () {
                pending = false
                const copies = callbacks.slice(0)
                callbacks.length = 0
                for (let i = 0; i < copies.length; i++) {
                    copies[i]()
                }
            }
        ```
        其中就有前面加入的 `flushSchedulerQueue`，它主要用于执行 `queue` 中所有 `watcher` 的 `run` 方法，从而使组件们更新
        ```js
            for (index = 0; index < queue.length; index++) {
                watcher = queue[index]
                watcher.run()
            }
        ```
        [参考原文](https://github.com/57code/vue-interview/blob/master/public/12/README.md)
---
## 响应式的理解
- 什么是响应式
    所谓数据响应式就是能够使数据变化可以被检测并对这种变化做出响应的机制。
- 为什么需要响应式
    MVVM框架，通过数据驱动视图更新
- 响应式的好处
    以vue为例，通过数据响应式以及虚拟dom和patch算法，可以有效减少对真实dom的操作，只需要通过操作数据。提高开发效率以及性能。
- vue如何实现响应式，有何缺点
    - vue2根据数据的类型做不同处理
        - 对象
            采用 `Object.defineProperty` 方式拦截
        - 数组
            覆盖数据原型的7个方法: `sort`; `revert`; `splice`; `pop`; `push`; `shift`; `unshift`
    - 缺点
        - 初始化时的遍历，会造成性能缺失
            - 初始化时需要遍历对象所有key，如果对象层级较深，性能不好
        - 通知更新过程需要维护大量dep实例和watcher实例，额外占用内存较多
        - 动态新增或删除属性，需要使用 `Vue.set/Vue.delete` api
        - 不支持es6的 `Map` 和 `Set` 数据结构
    - vue3
        使用 `Proxy` 实现响应式；
        响应化的实现代码抽出为独立的 `reactivity` 包，可以按需引入使用
---

## 拓展一个vue组件
- 逻辑拓展: `mixins`, `extends`
- 内容拓展: `slots`
- `mixins` 无法明确判断来源，且可能和当前组件内变量产生命名冲突。vue3引入了 `composition API` 新方式。
    ```js
    // 复用逻辑1
    function useXX() {}
    // 复用逻辑2
    function useYY() {}
    // 逻辑组合
    const Comp = {
        setup() {
            const {xx} = useXX()
            const {yy} = useYY()
            return {xx, yy}
        }
    }
    ```
---

