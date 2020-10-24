# Nest 的相关配置

## 读取环境变量

安装 @nestjs/config 依赖（内部实现依旧是 dotenv），然后在根模块导入：

```ts
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule.forRoot()],
})
```

## 如何鉴权

1. 中间件。以前在 express 时，写了一个校验请求有没有带 token 的中间件，如果有合法的 token，那就给 response 带上当前登录用户的信息，实现方式：`res.xxx = xxx;`
   但是 Nest.js 不让这么干了。提示 `xxx属性在Response属性上不存在`（虽然可以用 any）。并且中间件似乎要作用在 controller 上，而我想要的每个接口可以单独定义

2. 守卫 Guards。后续研究，看描述是可行的

## 如何返回数据时，排除一些敏感字段，如密码

1. 当然可以简单的在 return 前 delete user.password。但是这样需要在每个返回 user 或关联 user 信息时处理，很不优雅
2. 安装 class-transformer 库，然后用 @Exclude({ toPlainOnly: true }) 装饰 password 字段，仅在返回 json 时过滤掉 (还未成功)
3. 自己写一个装饰器（后续尝试）
