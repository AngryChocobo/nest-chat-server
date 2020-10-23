# Nest 的相关配置

## 读取环境变量

安装 @nestjs/config 依赖（内部实现依旧是 dotenv），然后在根模块导入：

```ts
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule.forRoot()],
})
```
