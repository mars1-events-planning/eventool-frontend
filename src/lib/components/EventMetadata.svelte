<script lang="ts">
	import EditEventModal from "./Modals/EditEventModal.svelte";
	import Edit from "./icons/Edit.svelte";
	import type { EventModel } from "$lib/components/controls/eventsModel";
	import { formatDateString } from "$lib/utils";
	import Collapse from "./Collapse.svelte";
	import Trash from "./icons/Trash.svelte";
	import WithConfirmation from "./Modals/WithConfirmation.svelte";
	import { graphql } from "$houdini";
	import { goto } from "$app/navigation";
	import NotesModal from "./Modals/NotesModal.svelte";
    import Note from "./icons/Note.svelte";

	let { event } = $props<{ event: EventModel }>();

	let store = graphql(`
		mutation DeleteEvent($input: DeleteEventInput!) {
			deleteEvent(input: $input) {
				gqlEvent {
					id
				}
				errors {
					code: __typename
					... on Error {
						message
					}
				}
			}
		}
	`);

	const renderValue = (value: string | null | undefined) => {
		if (value && value.length > 0) {
			return value;
		}

		return "Значение не задано";
	};
</script>

<Collapse checked canBeClosed={false}>
	<span slot="title" class="font-semibold">Событие: «{event.title}»</span>
	<div slot="content" class="flex flex-col">
		<div class="divider divider-end">
			<div class="flex flex-row-reverse items-center gap-4">
				<EditEventModal bind:event>
					<button class="btn btn-neutral btn-outline btn-xs"
						><Edit size={15} /></button
					>
				</EditEventModal>
				<NotesModal>
					<div class="btn btn-neutral btn-outline btn-xs">
						<Note size={15}/>
					</div>
				</NotesModal>
				<WithConfirmation
					title="Удалить событие"
					text="Вы уверены что хотите удалить событие? Восстановить его будет невозможно!"
					onCancelled={() => {}}
					onConfirmed={async () => {
						let result = await store.mutate({
							input: {
								eventId: event.id,
							},
						});

						if (result.data?.deleteEvent?.gqlEvent) {
							await goto(`/list`);
							return;
						}
					}}
				>
					<div class="btn btn-error btn-outline btn-xs" role="button">
						<Trash size={15} />
					</div>
				</WithConfirmation>
			</div>
		</div>
		<div class="grid grid-cols-8 font-sm gap-2">
			<span class="col-span-2 max-sm:col-span-8">Aдрес:</span>
			<span class="col-span-6 font-thin max-sm:col-span-8"
				>{renderValue(event.address)}</span
			>

			<span class="col-span-2 max-sm:col-span-8">Время начала:</span>
			<span class="col-span-6 font-thin max-sm:col-span-8"
				>{event.startAtUtc
					? formatDateString(event.startAtUtc)
					: "Значение не задано"}</span
			>

			<span class="col-span-2 max-sm:col-span-8">Описание:</span>
			<span class="col-span-6 font-thin max-sm:col-span-8"
				>{event.description}</span
			>
		</div>
	</div>
</Collapse>
