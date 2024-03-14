<template>
  <div>
    <div class="font-bold" :class="[color]">
      {{ title }}
    </div>
    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton v-if="loading" class="h-8 w-full" />
      <div v-else>
        {{ currency }}
      </div>
    </div>
    <div>
      <USkeleton v-if="loading" class="h-8 w-full" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon
          :name="icon"
          class="w-6 h-6"
          :class="{ green: trendingUp, red: !trendingUp }"
        />
        <div class="text-gray-500 dark:text-gray-400">
          {{ percentageTrend }} vs last period
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCurrency } from "~/composables/useCurrency";

const props = defineProps({
  title: String,
  amount: Number,
  lastAmount: Number,
  color: String,
  loading: Boolean,
});

const { currency } = useCurrency(props.amount);
const trendingUp = computed(() => props.amount > props.lastAmount);

const percentageTrend = computed(() => {
  if (props.amount === 0 || props.lastAmount === 0) return "∞";
  const bigger = Math.max(props.amount, props.lastAmount);
  const lower = Math.min(props.amount, props.lastAmount);

  const ratio = ((bigger - lower) / lower) * 100;

  return `${Math.ceil(ratio)}%`;
});

const icon = computed(() => {
  return trendingUp.value
    ? "i-heroicons-arrow-trending-up"
    : "i-heroicons-arrow-trending-down";
});
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400;
}
.red {
  @apply text-red-600 dark:text-red-400;
}
</style>
