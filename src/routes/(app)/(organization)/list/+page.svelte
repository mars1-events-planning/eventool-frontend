<script>
	import { graphql } from "$houdini";
	import Authorized from "$lib/components/Authorized.svelte";
	import CreateEventModal from "$lib/components/Modals/CreateEventModal.svelte";
	import { formatDateString } from "$lib/utils";
	import Trash from "$lib/components/icons/Trash.svelte";
	import Preloader from "$lib/components/icons/Preloader.svelte";
	import Create from "$lib/components/icons/Create.svelte";

	const eventsStore = graphql(`
		query PaginatedEvents($page: Int!) {
			events(page: $page) {
				id
				title
				createdAtUtc
				changedAtUtc
			}
		}
	`);

	let pageNumber = $state(1);
	const refetch = async () => {
		await eventsStore.fetch({
			variables: {
				page: pageNumber,
			},
		});
	};
	let events = $derived($eventsStore.data?.events ?? []);
	let nextAvailable = $derived(events.length === 15); // pagesize on backend

	$effect.pre(() => {
		refetch();
	});
</script>

<svelte:head>
	<title>Мероприятия</title>
</svelte:head>

<Authorized>
	<div class="flex flex-col gap-2 max-lg:items-center overflow-x-auto">
		<div class="flex flex-row w-full items-center gap-5 max-md:flex-row-reverse max-md:justify-between">
			<CreateEventModal>
				<div class="btn btn-primary btn-sm">
					<Create size={20} />
				</div>
			</CreateEventModal>
			<h1 class="font-semibold text-xl">Список событий</h1>
		</div>

		{#if events.length > 0}
			<div class="flex flex-wrap max-lg:justify-center gap-5">
				{#each events as e}
					{@const createdAt = formatDateString(e.createdAtUtc)}
					{@const changedAt = formatDateString(e.changedAtUtc)}

					<div
						class="flex flex-col border border-base-300 rounded-md p-4 max-w-[300px] min-w-[300px]"
					>
						<a href={`/event/${e.id}/edit`}>
							<div
								class="flex flex-row space-x-2 items-center font-semibold"
							>
								<div
									class="avatar placeholder text-neutral-content"
								>
									<div class="bg-primary w-10 rounded-full">
										<img
											src="https://wishpics.ru/site-images/wishpics_ru_3145.jpg"
											alt={e.title.slice(0, 2)}
										/>
									</div>
								</div>
								<div class="flex flex-col gap-1">
									<span class=" font-semibold">{e.title}</span
									>
									<div class="badge badge-ghost badge-sm">
										Создано: <span
											class="font-mono font-thin pl-1"
										>
											{createdAt}</span
										>
									</div>
								</div>
							</div>
						</a>
						<br />
						<button
							class="btn btn-outline btn-error btn-sm"
							onclick={() => {
								console.log(`mock delete ${e.id}`);
							}}
						>
							<Trash size={20} />
						</button>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center text-xl">
				События пока не добавлены
			</div>
		{/if}
		<div class="join w-full justify-center">
			<button
				class="join-item btn btn-ghost"
				disabled={pageNumber === 1}
				on:click={() => pageNumber--}
				>«
			</button>
			<button class="join-item btn btn-ghost">{pageNumber}</button>
			<button
				class="join-item btn btn-ghost"
				disabled={!nextAvailable}
				on:click={() => pageNumber++}
				>»
			</button>
		</div>
	</div></Authorized
>

<style lang="postcss">
	thead tr th {
		@apply text-base-content;
		@apply font-bold text-sm;
	}

	th {
		@apply bg-transparent;
	}

	tbody tr:hover {
		@apply bg-primary/10;
	}
</style>
