<script lang="ts">
	import EditEventModal from "./Modals/EditEventModal.svelte";
	import Edit from "./icons/Edit.svelte";
	import type { EventModel } from "$lib/components/controls/eventsModel";
	import { formatDateString } from "$lib/utils";
    import Collapse from "./Collapse.svelte";
    import Trash from "./icons/Trash.svelte";

	let { event } = $props<{ event: EventModel }>();

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
		<div class="flex flex-row w-full items-start max-sm:items-center gap-4">
			<EditEventModal bind:event>
				<button class="btn btn-neutral btn-outline btn-xs"
					><Edit size={20} /> Редактировать</button
				>
			</EditEventModal>
			<EditEventModal bind:event>
				<button class="btn btn-error btn-outline btn-xs"
					><Trash size={20} /> Удалить событие</button
				>
			</EditEventModal>
		</div>
		<div class="divider mt-0"></div>
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