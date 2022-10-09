<template>
  <UploadCustom
    :showCropper="false"
    text="上传图片"
    :limit="1"
    urlModel
    v-model:url="model[name]"
  />
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

import fieldProps from '../../../utils/fieldProps';
import { useAddField } from '../../../utils/useAddField';
import { UploadCustom } from '../components/upload-custom';

const props = defineProps({
  ...fieldProps,
  config: {
    type: Object,
    default: () => {},
  },
});
useAddField(props.prop);
</script>
<script lang="ts">
export default {
  name: 'm-fields-upload-picture',
};
</script>

<style scoped></style>
