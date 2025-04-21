<script setup lang="ts">
defineProps<{
  color: string;
}>()
</script>

<template>
<div class="inline-block w-4 h-4 rounded-full" :style="{backgroundColor: color || 'white'}"/>
</template>
