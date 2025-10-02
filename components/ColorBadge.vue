<script setup lang="ts">
defineProps<{
  color: string;
}>()
</script>

<template>
<div class="inline-block w-3 h-3 rounded-full" :style="{backgroundColor: color || 'white'}"/>
</template>
