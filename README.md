# Movie_Crawler

- node 的电影爬虫及 React-new 项目后台服务
- [前端项目地址]https://github.com/lightzhu/react-new
- 数据库使用 mlab 提供的免费云数据库[mlab]https://mlab.com/

# 1、git clone

# 2、npm install

# 3、npm test(启动一个热重载的应用)

- 启动时请修改 dbConfig 的数据库配置信息

# 4、npm start

# 将项目部署到 gearhost（免费的小程序托管云平台）

- gearhost 里面创建一个项目
- github 上面创建一个项目
- gitclone 到本地
- 将 gearhost 里面的 LocalGit Deployments 的项目地址添加的 git 中
- git remote add websites https://${你的项目名称}.scm.gear.host/${你的项目名称}.git
- 接下来就可以往 gearhost 的地址源里 push 你的代码了
- 在 gearhost 的项目面板里面设置 node 的版本号
- 不要指定 app 的端口，优先使用 process.env.PORT

# 设置开发环境

- 在 package.json 里设置对应的运行命令 export NODE_ENV='development'

# git 添加取消远程仓库

## 部署 heroku

- git remote add api https://git.heroku.com/imov.git
- git remote remove api
