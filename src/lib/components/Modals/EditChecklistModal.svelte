<script lang="ts">
	import { graphql } from '$houdini';
	import SuccessPopup from '../SuccessPopup.svelte';
	import LabeledInput from '../controls/LabeledInput.svelte';
	import type { Checklist } from '../controls/eventsModel';
	import Modal from './Modal.svelte';

	let { initialChecklist, eventId } = $props<{ initialChecklist?: Checklist; eventId: string }>();


	let success: boolean | undefined = $state(false);
	let checklist: Checklist = $state(null!);

	const reset = () => {
		checklist =
			initialChecklist ??
			({
				id: null!,
				title: '',
				items: []
			} as Checklist);
		success = undefined;
	}

	$effect.pre(() => {
		reset()
	});

	let store = graphql(`
		mutation SaveChecklist($input: SaveChecklistInput!) {
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
</script>

<Modal title="Сохранить этап мероприятия" onClose={() => reset()}>
	<div slot="button">
		<slot />
	</div>

	<form slot="content" class="grid grid-cols-5 gap-2 items-center">
		<LabeledInput
			id="title"
			name="title"
			bind:value={checklist.title}
			label="Название"
			type="text"
			labelClass="w-min col-span-1"
			inputClass="w-full bg-primary/15 col-span-4 input-sm"
		/>
		<span class="col-span-5">Задачи:</span>
		{#each checklist.items as _, i}
			<div class="flex flex-row items-center justify-between">
				<span>{i + 1}.</span>
				<input type="checkbox" class="checkbox" bind:checked={checklist.items[i].done} />
			</div>
			<input
				type="text"
				class="input input-bordered col-span-4 input-xs"
				bind:value={checklist.items[i].title}
			/>
		{/each}
		<button
			class="btn btn-sm btn-primary btn-outline col-span-5"
			onclick={() => {
				checklist.items.push({
					done: false,
					title: ''
				});
			}}
		>
			<span class="font-bold text-lg">+</span>
			Добавить задачу
		</button>
		<br />
		<button
			type="button"
			class="btn col-span-5 btn-primary w-full"
			disabled={checklist.title.trim().length === 0}
			onclick={async () => {
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
		>
			Сохранить
		</button>
		{#if success}
			<div class="flex flex-col col-span-5 items-center justify-center">
				<SuccessPopup />
			</div>
		{/if}
	</form>
</Modal>