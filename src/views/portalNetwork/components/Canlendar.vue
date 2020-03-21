<template>
  <div class="canlendarPanel">
    <div class="canlendar-header">
      <p class="pre cursor-pointer">
        <span @click="changeDate('preYear')">
          <i class="el-icon-d-arrow-left" name="preYear" ></i>
        </span>
        <span @click="changeDate('preMonth')">
          <i class="el-icon-arrow-left" name="preMonth" ></i>
        </span>
      </p>
      <p class="currenDate">{{ `${year}年${month}月` }}</p>
      <p class="next cursor-pointer">
        <span @click="changeDate('nextMonth')">
          <i class="el-icon-arrow-right" name="nextMonth" ></i>
        </span>
        <span @click="changeDate('nextYear')">
          <i class="el-icon-d-arrow-right" name="nextYear" ></i>
        </span>
      </p>
    </div>
    <div class="canlendar-main">
      <ul class="main-header">
        <li v-for="(item, index) in week">
          {{ item }}
        </li>
      </ul>
      <ul class="main">
        <li v-for="inx in weekDay" class="disabled">
          {{ preMonthSize() - weekDay + inx }}
        </li>
        <li
          v-for="index in monthList[month - 1]"
        >
          <span
            :class="{ currentDay: index === day }"
          >
            {{ index }}</span
          >
        </li>
        <li v-for="index in lastWeekDay" class="disabled">{{ index }}</li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
// import { Component } from 'com/vue-ts'
// @Component
export default { 
  data(){
    return {
      year: 0,
      month:  0,
      day:  0,
      week:  ['日', '一', '二', '三', '四', '五', '六'],
      monthList: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      weekDay: 1,
      lastWeekDay:  1,
    }
  }, 
  created() {
    this.getCurrentDate()
    this.initDate()
  },
  methods: {
    // 上一个月有多少天
    preMonthSize() {
      return this.month - 1 === 0 ? 31 : this.monthList[this.month - 2]
    },
    // 获得今天的日期
    getCurrentDate() {
      const date = new Date()
      this.year = date.getFullYear()
      this.month = date.getMonth() + 1
      this.day = date.getDate()
    },
    // 根据年月日获得为星期几
    getWeekDay(year, month, day) {
      return new Date(`${year}/${month}/${day}`).getDay()
    },
    initDate() {
      if (
        (this.year % 4 === 0 && this.year % 100 !== 0) ||
        this.year % 400 === 0
      ) {
        this.monthList[1] = 29
      } else {
        this.monthList[1] = 28
      }
      // 获得指定年月的1号是星期几
      const firstDay = this.getWeekDay(this.year, this.month, 1)
      // 在1号前面填充多少个上个月的日期
      this.weekDay = firstDay === 7 ? 0 : firstDay
      // 获得最后一天是星期几，往后填充多少个
      const remineDay = this.getWeekDay(
        this.year,
        this.month,
        this.monthList[this.month - 1]
      )
      this.lastWeekDay = remineDay === 7 ? 6 : 6 - remineDay
    },
    changeDate(type) {
      switch (type) {
        case 'preYear':
          this.year -= 1
          break
        case 'preMonth':
          // 当前月份为1月， 上一个月分为12月，年份减1
          if (this.month === 1) {
            this.month = 12
            this.year -= 1
          } else {
            this.month -= 1
          }
          break
        case 'nextYear':
          this.year += 1
          break
        case 'nextMonth':
          // 当前月份为12月， 下个月分为1月，年份加1
          if (this.month === 12) {
            this.month = 1
            this.year += 1
          } else {
            this.month += 1
          }
          break
        default:
          break
      }
      this.initDate()
    }
  }
}
</script>

<style lang="less" scoped>
.canlendarPanel {
  height: auto;
  border-bottom: 3px solid var(--background);
  display: flex;
  flex-direction: column;
  .canlendar-header {
    line-height: 30px;
    background: var(--special-bg);
    display: flex;
    flex-direction: row;
    justify-content: center;
    .currenDate {
      margin: 0 20px;
      font-size: 16px;
      font-family: PingFangSC-Medium;
    }
    .icon {
      width: 12px;
      height: 12px;
    }
  }
  .canlendar-main {
    /*flex: 1;
    display: flex;
    flex-direction: column;*/
    .main-header {
      /*display: flex;*/
      line-height: 30px;
      color: var(--text-color);
      li {
        /*flex: 1;*/
        width: 35px;
        display: inline-block;
        text-align: center;
      }
    }
    ul.main {
      /*flex: 1;*/
      /*display: flex;*/
      /*flex-wrap: wrap;*/
      align-items: center;
      padding-bottom: 10px;
      font-size: 14px;
      li { 
        position: relative;
        width: 35px;
        line-height: 25px;
        cursor: pointer;
        text-align: center;
        display: inline-block;
      }
      .disabled {
        color: var(--text-color);
        cursor: default;
      }
      .currentDay:before {
        content: '';
        position: absolute;
        display: inline-block;
        left: 6px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid #FFE100;
      }
    }
  }
}
</style>