<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Sessions',
    to: '/',
    active: route.path === '/'
  },
  {
    label: 'Devices',
    to: '/devices',
    active: route.path === '/devices'
  },
  {
    label: 'Teams',
    to: '/teams',
    active: route.path === '/teams'
  },
  {
    label: 'Connect',
    to: '/connect',
    active: route.path === '/connect'
  },
])
</script>

<template>
  <UHeader>
    <template #title>
        <span>Trackie</span>
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />

      <UTooltip text="Open on GitHub" :kbds="['meta', 'G']">
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/stranavad"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />
      </UTooltip>
    </template>
  </UHeader>
</template>
