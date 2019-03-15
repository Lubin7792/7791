const state={
    name:{
        //用户管理
        newUser:1,
        editUser:2,
        deleteUser:3,
        // 角色管理
        seeRole: 1,
        newRole: 2,
        editRole: 3,
        deleteRole: 4,
        setPower:5,
        // 任务监控
        taskMonitor: 1,
        cancleTask:2,
        // 客户端
        seeClient:1,
        setClient:2,
        // 服务管理
        seeServer:1,
        setSever:2,
        // 日志管理
        seeSyslog:1,
        exportSyslog:2,
        // 介质服务器
        seeMediaServer:1,
        addMediaServer:2,
        deleteMediaserver:3,
        // 介质管理
        seeDiskDevice: 1,
        newDiskDevice: 2,
        editDiskDevice: 3,
        deleteDiskDevice:4,
        // 介质管理-介质
        seeValume: 1,
        newValume: 2,
        editValume: 3,
        binValume: 4,
        seeMedium: 5,
        deleteMedium: 6,
        reviseMedium:7,
        recoveryMedium:8,
        // 策略管理
        seePolicy:1,
        newPolicy: 2,
        editPolicy: 3,
        deletePolicy: 4,
        dispatchPolicy: 5,
        enablePolicy:6,
        // 恢复管理 
        restore:1,
        // 报表管理
        seeRunReprot: 1,
        seeDeviceReprot: 2,
        seeMediaReprot:3,
        // 系统设置
        setSecurityLevel:1,
        setsysset:2,
        setEmail:3
    },
    module:{
        userManager:2,
        role:3,
        taskMonitor:4,
        client:5,
        server:6,
        syslog:7,
        mediaServer: 8,
        diskDevice:9,
        volume:10,
        policy:11,
        restore:12,
        report:13,
        sysset:14,
        home:1

    }
}
export default {
    state
}