<template>
    <UCard v-if="!success">
        <template #header>
            Sign-in to Finance Tracker
        </template>
        <form @submit.prevent="handleLogin">
            <UFormGroup label="Email" name="email" :required="true" class="mb-4">
                <UInput v-model="email" type="email" placeholder="Email" required />
            </UFormGroup>
            <UFormGroup label="Password" name="password" :required="true" class="mb-4">
                <UInput v-model="password" type="password" placeholder="******" autocomplete="on" required />
            </UFormGroup>

            <UButton type="submit" variant="solid" color="black" :loading="pending">Sign-In</UButton>
        </form>
    </UCard>
    <UCard v-else>
        <template #header>
            Email has been sent
        </template>
        <div class="text-center">
            <p class="mb-4">We have send an email to <strong>{{ email }}</strong> with a link to sign-in</p>
            <p>
                <strong>Important: </strong>
                The link will expire in 5 minutes
            </p>
        </div>
    </UCard>
</template>

<script setup>
const success = ref(false)
const email = ref('')
const password = ref('')

const pending = ref(false)
const { toastError } = useAppToast()
const supabase = useSupabaseClient()
useRedirectIfAuthenticated()

const handleLogin = async () => {
    pending.value = true

    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })

        if (error) {
            toastError({
                title: 'Error authenticating',
                descrption: error.message,
            })
        } else {
            success.value = true
        }
    } finally {
        pending.value = false
    }
}
</script>