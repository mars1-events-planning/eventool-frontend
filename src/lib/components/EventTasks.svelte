<script lang="ts">
	import Checklist from "$lib/components/controls/Checklist/Checklist.svelte";
	import RoundProgress from "$lib/components/RoundProgress.svelte";
	import EditChecklistModal from "./Modals/EditChecklistModal.svelte";
	import type { EventModel } from "./controls/eventsModel";
	import Collapse from "./Collapse.svelte";

	let { event } = $props<{ event: EventModel }>();

	let progress = $derived(
		(event.checklists.flatMap((c) => c.items).filter((c) => c.done).length /
			event.checklists.flatMap((c) => c.items).length) *
			100,
	);
</script>

<Collapse>
	<div slot="title">
		<div class="flex flex-row gap-4 items-center justify-between">
			<span class="font-semibold">Задачи</span>
			<RoundProgress progressPercent={progress} />
		</div>
	</div>
	<div slot="content" class="flex flex-col">
		<div class="divider divider-end">
			<EditChecklistModal eventId={event.id}>
				<button
					type="button"
					class="btn btn-primary btn-outline font-bold btn-xs"
				>
					<span class="text-base">+</span>
				</button>
			</EditChecklistModal>
		</div>

		{#if event.checklists.length > 0}
			<div class="flex flex-wrap gap-5 justify-normal">
				{#each event.checklists as _, i}
					<Checklist
						checklist={event.checklists[i]}
						eventId={event.id}
					/>
				{/each}
				<div class="flex flex-col w-full items-center"></div>
			</div>
		{:else}
			Задач пока нет
		{/if}
	</div>
</Collapse>
