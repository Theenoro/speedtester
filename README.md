# speedtester

![Preview](https://raw.githubusercontent.com/Theenoro/speedtester/master/preview.png)

click on it for better res

# Linux

install https://nodejs.org/en/
place script someware
& run
```bash
chmod +x index.js
sudo apt-get install speedtest-cli
```

## manual start
```bash
./index.js
#or
node index.js
```


## Cron every 2 hours

```bash
crontab -e

0 */2 * * * /script/path/index.js >/dev/null 2>&1

```
and for logging
´´´bash
0 */2 * * * /script/path/index.js >>/script/path/log.txt 2>&1
```

---
# ***TODO***

## Windows

1. install https://nodejs.org/en/
2. download https://github.com/zpeters/speedtest/releases for your windows system and rename the file to **speedtest-cli.exe**
3. put the **index.js** in the same folder as the **speedtest-cli.exe**
4. open **cmd** and navigate to the folder  and run **node index.js**

### Automatic

1. run Task Scheduler
2. create new Task
3. ** toDo **
