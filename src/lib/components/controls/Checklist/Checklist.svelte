<script lang="ts">
	import { graphql } from '$houdini';
	import EditChecklistModal from '$lib/components/Modals/EditChecklistModal.svelte';
	import RoundProgress from '$lib/components/RoundProgress.svelte';
	import type { Checklist } from '../eventsModel';

	let { checklist, eventId } = $props<{ checklist: Checklist; eventId: string }>();
	let success: boolean | undefined = $state(undefined);

	let store = graphql(`
		mutation SaveChecklistWithCheckedItem($input: SaveChecklistInput!) {
			saveChecklist(input: $input) {
				gqlEvent {
					checklists {
						id
						title
						items {
							title
							done
						}
					}
				}
				errors {
					... on ValidationError {
						errors {
							propertyName
							errorMessage
						}
					}
				}
			}
		}
	`);

	let progress = $derived(
		(checklist.items.filter((x) => x.done).length / checklist.items.length) * 100
	);

	let getId = () => {
		crypto.randomUUID();
	};
</script>

<div class="flex flex-col border w-fit p-4 rounded-md h-min">
	<EditChecklistModal initialChecklist={checklist} {eventId}>
		<div class="flex flex-row justify-between items-center gap-5">
			<h3 class="font-semibold">{checklist.title}</h3>
			<RoundProgress progressPercent={progress} />
		</div>
	</EditChecklistModal>
	<div class="divider m-0"></div>
	<div class="flex flex-col gap-2">
		{#each checklist.items as item, i}
			{@const id = checklist.id + '-' + i}
			<div class="flex flex-row gap-4">
				<input
					type="checkbox"
					id={id}
					class="checkbox checkbox-primary"
					checked={checklist.items[i].done}
					onclick={async () => {
						checklist.items[i].done = !checklist.items[i].done;
						let result = await store.mutate({
							input: {
								eventId: eventId,
								checklistId: checklist.id,
								title: checklist.title,
								items: checklist.items
							}
						});

						if (result.data?.saveChecklist?.gqlEvent) {
							success = true;
							return;
						}
						success = false;
					}}
				/>
				<label for={id}>{item.title}</label>
			</div>
		{/each}
	</div>
</div>
