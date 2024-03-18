<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> {{ isEditing ? 'Edit' : 'Add' }} Transaction </template>

      <UForm @submit="save" :state="state" :schema="schema" ref="form">
        <UFormGroup label="Transaction Type" name="type" :required="true" class="mb-4">
          <USelect v-model="state.type" placeholder="Select the transaction type" :options="types"
            :disabled="isEditing" />
        </UFormGroup>

        <UFormGroup label="Amount" :required="true" name="amount" class="mb-4">
          <UInput v-model.number="state.amount" type="number" placeholder="Amount" />
        </UFormGroup>

        <UFormGroup label="Transaction date" :required="true" name="created_at" class="mb-4">
          <UInput v-model="state.created_at" type="date" icon="i-heroicons-calendar-days-20-solid" />
        </UFormGroup>

        <UFormGroup label="Description" name="description" hint="Optional" class="mb-4">
          <UInput v-model="state.description" type="text" />
        </UFormGroup>

        <UFormGroup v-if="state.type === 'Expense'" label="Category" name="category" :required="true" class="mb-4">
          <USelect v-model="state.category" placeholder="Category" :options="categories" />
        </UFormGroup>
        <UButton type="submit" color="black" variant="solid" label="Save" :loading="isLoading" />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { z } from "zod";
import { categories, types } from "~/constants";
const props = defineProps({
  modelValue: Boolean,
  transaction: {
    type: Object,
    required: false
  }
});

const emit = defineEmits(["update:modelValue", 'saved']);

const supabase = useSupabaseClient()
const { toastSuccess, toastError } = useAppToast()
const form = ref();
const isLoading = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) resetForm();
    emit("update:modelValue", value);
  },
});

const isEditing = computed(() => !!props.transaction)

const initialState = isEditing.value ? {
  type: props.transaction.type,
  amount: props.transaction.amount,
  created_at: props.transaction.created_at.split('T')[0],
  description: props.transaction.description,
  category: props.transaction.category,
} : {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
};

const state = ref({ ...initialState });

const resetForm = () => {
  Object.assign(state.value, initialState);
  form.value.clear();
};

const save = async () => {
  if (form.value.errors.length) return;
  isLoading.value = true

  try {
    const { error } = await supabase
      .from('transactions')
      .upsert({
        ...state.value,
        id: props.transaction?.id
      })

    if (!error) {
      toastSuccess({
        title: 'Transaction saved',
      })
      isOpen.value = false
      emit('saved')
      return
    }

    throw error

  } catch (error) {
    toastError({
      title: 'Transaction not saved',
      description: error.message,
      color: 'red'
    })
  } finally {
    isLoading.value = false
  }
};

const defaultSchema = z.object({
  created_at: z.string(),
  description: z.string().optional(),
  amount: z.number().positive("Amount needs to be more than 0"),
});

const incomeSchema = z.object({
  type: z.literal("Income"),
});

const investmentSchema = z.object({
  type: z.literal("Investment"),
});

const savingSchema = z.object({
  type: z.literal("Saving"),
});

const expenseSchema = z.object({
  type: z.literal("Expense"),
  category: z.enum(categories),
});

const schema = z.intersection(
  z.discriminatedUnion("type", [
    incomeSchema,
    expenseSchema,
    investmentSchema,
    savingSchema,
  ]),
  defaultSchema
);


</script>
