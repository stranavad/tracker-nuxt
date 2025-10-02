<template>
  <UApp>
      <Header/>
      <UMain>
          <UContainer class="pt-4">
              <NuxtPage/>
          </UContainer>
      </UMain>
    <!-- <div>
      <div class="w-screen px-2 py-3 border-b border-b-gray-500 mb-2 flex justify-between">
        <NuxtLink to="/" class="hover:text-slate-500">Trackie</NuxtLink>
        <div class="flex gap-4">
          <NuxtLink to="/teams" class="hover:text-slate-500">Teams</NuxtLink>
          <NuxtLink to="/devices" class="hover:text-slate-500">Devices</NuxtLink>
          <NuxtLink to="/connect" class="hover:text-slate-500">Connect</NuxtLink>
        </div>
      </div>
      <div class="px-2">
        <NuxtPage/>
      </div>
    </div> -->
  </UApp>
</template>
