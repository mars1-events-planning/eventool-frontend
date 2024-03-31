<script>
	import Logo from "$lib/components/icons/Logo.svelte";

	let innerWidth = $state(0);
</script>

<svelte:window bind:innerWidth />

<svelte:head>
	<title>Eventool</title>
</svelte:head>

<div class="flex flex-col items-center justify-center h-[100vh] gap-20">
	<div class="text-primary">
		<Logo size={innerWidth > 768 ? 750 : 250} />
	</div>
	<div class="flex flex-row space-x-10 items-center">
		<a class="btn btn-ghost lg:btn-lg md:btn-md sm:btn-sm" href="/register">Регистрация</a>
		<a class="btn btn-neutral lg:btn-lg md:btn-md sm:btn-sm" href="/login">Вход</a>
	</div>
</div>
