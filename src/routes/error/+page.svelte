<script>
	import { browser } from "$app/environment";
	import { page } from '$app/stores';

	const code = $page.url.searchParams.get('code') ?? 500;
</script>

<svelte:head>
	<title>Ошибка!</title>
</svelte:head>

<div class="flex flex-col items-center justify-center h-[100vh] gap-20">
	<div class="flex flex-col items-center justify-center">
		<span class="text-primary text-9xl">{code}</span>
		<span class="text-xl">Произошла ошибка!</span>
	</div>

	{#if browser}
		<div class="flex flex-row space-x-10 items-center">
			<button
				class="btn btn-ghost lg:btn-lg md:btn-md sm:btn-sm"
				onclick={() => window.history.back()}
			>
				<span>&#x2190;</span>
				Назад
			</button>
			<a
				class="btn btn-primary lg:btn-lg md:btn-md sm:btn-sm"
				href="/login">Главная</a
			>
		</div>
	{/if}
</div>
