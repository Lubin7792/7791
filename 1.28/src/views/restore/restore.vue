<style>
.restore .ivu-row {
  line-height: 90px;
  border:1px dashed #fb784d;
  border-radius: 5px;
  background: #f3f3f3;
  margin-bottom: 20px;
  margin-left: 0px!important;
  margin-right: 0px!important;
}
</style>
<template>
  <div class="restore">
    <!-- 头部导航 -->
    <Row :gutter="14">
        <Col span="6">
          客户端名称：
          <Input prefix="ios-contact" placeholder="请输入客户端名称" style="width: auto" />
        </Col>
        <Col span="6">
          起始时间:
          <DatePicker type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
        </Col>
        <Col span="6">
          结束时间:
          <DatePicker type="date" placeholder="请选择日期" style="width: 200px"></DatePicker>
        </Col>
        <Col span="2">
          <Button type="error" icon="ios-search" style="background:red" size="small">查询</Button>
        </Col>
    </Row>
    <!-- 表格部分 -->
    <Table :columns="columns1" :data="data1"></Table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      columns1: [
        {
          title: "客户端",
          key: "client"
        },
        {
          title: "策略",
          key: "strategy"
        },
        {
          title: "开始时间",
          key: "startTime"
        },
        {
          title: "完成时间",
          key: "completionTime",
        },
        {
          title: "备份类型",
          key: "backupType"
        },
        {
          title: "文件数量",
          key: "number"
        },
        {
          title: "备份量",
          key: "backup"
        },
      ],
      data1: [
        {
          client: "测试1",
          strategy: 1111,
          startTime: "2018.8.30",
          completionTime: "2018.8.30",
          backupType:22222,
          number: 1,
          backup:22
        },
        {
          client: "测试2",
          strategy: 1111,
          startTime: "2018.8.30",
          completionTime: "2018.8.30",
          backupType:22222,
          number: 1,
          backup:22
        },
        {
          client: "测试3",
          strategy: 1111,
          startTime: "2018.8.30",
          completionTime: "2018.8.30",
          backupType:22222,
          number: 1,
          backup:22
        },
        {
          client: "测试4",
          strategy: 1111,
          startTime: "2018.8.30",
          completionTime: "2018.8.30",
          backupType:22222,
          number: 1,
          backup:22
        },
        {
          client: "测试5",
          strategy: 1111,
          startTime: "2018.8.30",
          completionTime: "2018.8.30",
          backupType:22222,
          number: 1,
          backup:22
        },
        {
          client: "测试6",
          strategy: 1111,
          startTime: "2018.8.30",
          completionTime: "2018.8.30",
          backupType:22222,
          number: 1,
          backup:22
        },
      ]
    };
  }
};
</script