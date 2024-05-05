<script lang="ts">
	import EditEventModal from "./Modals/EditEventModal.svelte";
	import Edit from "./icons/Edit.svelte";
	import type { EventModel } from "$lib/components/controls/eventsModel";
	import { formatDateString } from "$lib/utils";
    import Collapse from "./Collapse.svelte";

	let { event } = $props<{ event: EventModel }>();

	const renderValue = (value: string | null | undefined) => {
		if (value && value.length > 0) {
			return value;
		}

		return "Значение не задано";
	};
</script>

<Collapse>
	<span slot="title" class="font-semibold">Основные данные</span>
	<div slot="content" class="flex flex-col gap-4">
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
		<div class="flex flex-col w-full items-start max-sm:items-center">
			<EditEventModal bind:event>
				<button class="btn btn-neutral btn-outline btn-xs"
					><Edit size={20} /> Редактировать</button
				>
			</EditEventModal>
		</div>
	</div>
</Collapse>