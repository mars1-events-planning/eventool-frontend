<script lang="ts">
	import { graphql } from "$houdini";
	import EditChecklistModal from "$lib/components/Modals/EditChecklistModal.svelte";
	import RoundProgress from "$lib/components/RoundProgress.svelte";
	import type { Checklist } from "../eventsModel";

	let { checklist, eventId } = $props<{
		checklist: Checklist;
		eventId: string;
	}>();
	let success: boolean | undefined = $state(undefined);

	let store = graphql(`
		mutation UpdateChecklist($input: SaveEventInput!) {
			saveEvent(input: $input) {
				gqlEvent {
					id
					title
					creator {
						id
					}
					createdAtUtc
					changedAtUtc
					startAtUtc
					description
					address
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
					code: __typename
					... on Error {
						message
					}
					... on ValidationError {
						errors {
							errorMessage
							propertyName
						}
					}
				}
			}
		}
	`);

	let progress = $derived(
		(checklist.items.filter((x) => x.done).length /
			checklist.items.length) *
			100,
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
			{@const id = checklist.id + "-" + i}
			<div class="flex flex-row gap-4">
				<input
					type="checkbox"
					{id}
					class="checkbox checkbox-primary"
					checked={checklist.items[i].done}
					onclick={async () => {
						checklist.items[i].done = !checklist.items[i].done;
						let result = await store.mutate({
							input: {
								input: {
									eventId: eventId,
									checklists: {
										id: checklist.id,
										title: checklist.title,
										checklistItems: checklist.items,
									}	
								}
								
							},
						});

						if (result.data?.saveEvent?.gqlEvent) {
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
