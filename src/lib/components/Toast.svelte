<script lang="ts">
	import { toast } from '$lib/toast.svelte';
</script>

{#if toast.visible}
	<div
		class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-sm text-dark-text shadow-lg
			animate-toast-in"
	>
		{toast.message}
	</div>
{/if}

<style>
	@keyframes toast-in {
		from {
			opacity: 0;
			transform: translate(-50%, 8px);
		}
		to {
			opacity: 1;
			transform: translate(-50%, 0);
		}
	}
	.animate-toast-in {
		animation: toast-in 0.2s ease-out forwards;
	}
</style>
