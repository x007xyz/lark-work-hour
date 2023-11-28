<script setup lang="ts">
import dayjs from 'dayjs'
import { calculateWorkSchedule } from "./calculateWorkSchedule";
import { onMounted, reactive, ref } from 'vue';
import { IFieldMeta, ITableMeta, bitable, IRecordList, IRecordValue, ICell, ITable, FieldType } from '@lark-base-open/js-sdk';
import { computed } from 'vue';

const fieldOptions = ref<IFieldMeta[]>([]);

const loading = ref<Boolean>(false);

const form = reactive({
  startTime: new Date(),
  workHours: 8,
  workHoursField: '',
  startTimeField: '',
  endTimeField: '',
  groupField: ""
})
const arr = calculateWorkSchedule([4, 6, 9, 0, 12, 25], dayjs('2023-10-01'))

arr.forEach((item) => {
  console.log('开始时间', item[0].format('YYYY-MM-DD HH:mm:ss'))
  console.log('结束时间', item[1].format('YYYY-MM-DD HH:mm:ss'))
})

let table: ITable;

let recordIdList: string[];

onMounted(async () => {
  const selection = await bitable.base.getSelection();
  table = await bitable.base.getTableById(selection.tableId);
  const view = await table.getViewById(selection.viewId);
  recordIdList = await view.getVisibleRecordIdList();
  fieldOptions.value = await table.getFieldMetaList();
})

const workHoursFieldOptions = computed(() => {
  return fieldOptions.value.filter((item) => item.type === FieldType.Number)
})

const startTimeFieldOptions = computed(() => {
  return fieldOptions.value.filter((item) => item.type === FieldType.DateTime && item.id !== form.endTimeField)
})

const endTimeFieldOptions = computed(() => {
  return fieldOptions.value.filter((item) => item.type === FieldType.DateTime && item.id !== form.startTimeField)
})

const rules = {
  workHours: [
    { required: true, message: '请输入每日工时', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'blur' },
  ],
  workHoursField: [
    { required: true, message: '请选择工时字段', trigger: 'blur' },
  ],
  startTimeField: [
    { required: true, message: '请选择开始时间字段', trigger: 'blur' },
  ],
  endTimeField: [
    { required: true, message: '请选择结束时间字段', trigger: 'blur' },
  ],
}

async function handleSubmit() {
  loading.value = true;
  let _startTime = dayjs(dayjs(form.startTime).format('YYYY-MM-DD'));
  const startTimeField = await table.getFieldById(form.startTimeField)
  const endTimeField = await table.getFieldById(form.endTimeField)
  // 获取工时字段的所有数据
  for (const recordId of recordIdList) {
    const val = await table.getCellValue(form.workHoursField, recordId);
    const list = calculateWorkSchedule([Number(val)], _startTime, form.workHours);
    startTimeField.setValue(recordId, +list[0][0])
    endTimeField.setValue(recordId, +list[0][1])
    _startTime = list[0][1];
  }
  loading.value = false;
}
</script>

<template>
  <ASpin :loading="loading" :tip="'数据生成中~~'" style="display: block;">
    <AForm :model="form" layout="vertical" @submit="handleSubmit" :rules="rules">
      <AFormItem label="每日工时" field="workHours">
        <AInputNumber v-model="form.workHours" />
      </AFormItem>
      <AFormItem label="开始时间" field="startTime">
        <ADatePicker v-model="form.startTime" style="width: 100%;"/>
      </AFormItem>
      <AFormItem label="工时字段" field="workHoursField">
        <ASelect v-model="form.workHoursField" allow-clear>
          <AOption v-for="item in workHoursFieldOptions" :value="item.id" :label="item.name"></AOption>
        </ASelect>
      </AFormItem>
      <AFormItem label="开始时间字段" field="startTimeField">
        <ASelect v-model="form.startTimeField" allow-clear>
          <AOption v-for="item in startTimeFieldOptions" :value="item.id" :label="item.name"></AOption>
        </ASelect>
      </AFormItem>
      <AFormItem label="结束时间字段" field="endTimeField">
        <ASelect v-model="form.endTimeField" allow-clear>
          <AOption v-for="item in endTimeFieldOptions" :value="item.id" :label="item.name"></AOption>
        </ASelect>
      </AFormItem>
      <!-- <AFormItem label="分组字段" field="groupField">
        <ASelect v-model="form.groupField" allow-clear>
          <AOption v-for="item in fieldOptions" :value="item.id" :label="item.name"></AOption>
        </ASelect>
      </AFormItem> -->
      <AFormItem>
        <AButton type="primary" html-type="submit">生成</AButton>
      </AFormItem>
    </AForm>
  </ASpin>
</template>

