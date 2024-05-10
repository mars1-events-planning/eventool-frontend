<script>
	import { graphql } from "$houdini";
	import Authorized from "$lib/components/Authorized.svelte";
	import CreateEventModal from "$lib/components/Modals/CreateEventModal.svelte";
	import { formatDateString } from "$lib/utils";
	import Trash from "$lib/components/icons/Trash.svelte";
	import Create from "$lib/components/icons/Create.svelte";

	const eventsStore = graphql(`
		query PaginatedEvents($page: Int!) {
			events(page: $page) {
				id
				title
				createdAtUtc
				changedAtUtc
				photos
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
		<h1 class="font-semibold text-xl">Список событий</h1>
		<div
			class="divider divider-end"
		>
			<CreateEventModal>
				<div class="btn btn-primary btn-sm btn-outline">
					<Create size={20} />
				</div>
			</CreateEventModal>
			
		</div>

		{#if events.length > 0}
			<div
				class="grid grid-flow-row auto-rows-max grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-10 justify-items-center"
			>
				{#each events as e}
					{@const createdAt = formatDateString(e.createdAtUtc)}
					{@const changedAt = formatDateString(e.changedAtUtc)}

					<div
						class="flex flex-col border rounded-md p-4
						max-w-[250px] min-w-[250px]
						max-h-[400px] min-h-[400px]
						shadow-lg shadow-base-content/25
						hover:shadow-primary/50 hover:border-primary hover:ease-in hover:duration-100"
					>
						<a href={`/event/${e.id}/edit`}>
							<div
								class="flex flex-col space-y-5 items-center font-semibold"
							>
								<div
									class="avatar placeholder text-neutral-content"
								>
									<div class="bg-primary rounded-md">
										{#if e.photos.length > 0}
											<img
												src={e.photos[0]}
												alt={e.title.slice(0, 2)}
											/>
										{:else}
											<img
												src="https://wishpics.ru/site-images/wishpics_ru_3145.jpg"
												alt={e.title.slice(0, 2)}
											/>
										{/if}
									</div>
								</div>
								<div
									class="flex flex-col gap-1 justify-between"
								>
									<div
										class="min-h-[60px] max-h-[60px] max-w-[220px] flex-grow w-full overflow-hidden"
									>
										<!-- WANT TO BREAK THIS TEXT SO IT NOT OVERGROW THE CARD -->
										<span
											class="font-semibold block truncate whitespace-break-spaces overflow-ellipsis"
											>{e.title}</span
										>
									</div>
									<div class="flex-grow mt-auto">
										<div class="divider m-0 top-auto"></div>
										<span class="text-xs">
											Создано: <span
												class="font-mono font-thin pl-1"
											>
												{createdAt}</span
											>
										</span>
										<span class="text-xs">
											Изменено: <span
												class="font-mono font-thin pl-1"
											>
												{changedAt}</span
											>
										</span>
									</div>
								</div>
							</div>
						</a>
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
