<script lang="ts">
	import { graphql } from "$houdini";
	import SuccessPopup from "../SuccessPopup.svelte";
	import LabeledInput from "../controls/LabeledInput.svelte";
	import ValidationErrorsList from "../controls/ValidationErrorsList.svelte";
	import type { Checklist } from "../controls/eventsModel";
	import Confirm from "../icons/Confirm.svelte";
	import Trash from "../icons/Trash.svelte";
	import Modal from "./Modal.svelte";
	import WithConfirmation from "./WithConfirmation.svelte";

	let { initialChecklist, eventId } = $props<{
		initialChecklist?: Checklist;
		eventId: string;
	}>();

	let success: boolean | undefined = $state(undefined);
	let checklist: Checklist = $state(null!);

	const reset = () => {
		checklist =
			initialChecklist ??
			({
				id: null!,
				title: "",
				items: [],
			} as Checklist);
		success = undefined;
		console.log("reset");
	};

	$effect.pre(() => {
		reset();
	});

	let store = graphql(`
		mutation SaveChecklist($input: SaveEventInput!) {
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

	let deleteStore = graphql(`
		mutation DeleteChecklist($input: DeleteChecklistInput!) {
			deleteChecklist(input: $input) {
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
					code: __typename
					... on Error {
						message
					}
				}
			}
		}
	`);

	let validationErrors = $derived(
		$store.data?.saveEvent?.errors
			?.filter((error) => error.code === "ValidationError")
			?.flatMap((error) => ("errors" in error ? error.errors : []))
			?.map((error) => error!) ?? [],
	);

	let modal: Modal;
</script>

<Modal title="Сохранить чеклист" onClose={() => reset()} bind:this={modal}>
	<div slot="button">
		<slot />
	</div>

	<form slot="content" class="grid grid-cols-5 gap-2 items-center w-full">
		<div class="col-span-5 flex flex-col">
			<div class="divider m-0 divider-end">
				<div class="flex flex-row-reverse gap-4">
					<button
						type="button"
						class="btn btn-xs btn-primary"
						disabled={checklist.title.trim().length === 0}
						onclick={async () => {
							let result = await store.mutate({
								input: {
									input: {
										eventId: eventId,
										checklists: {
											id: checklist.id,
											title: checklist.title,
											checklistItems: checklist.items,
										},
									},
								},
							});

							if (result.data?.saveEvent?.gqlEvent) {
								modal.close();
								return;
							}
						}}
					>
						<Confirm size={20} />
					</button>
					{#if initialChecklist}
						<WithConfirmation
							title="Удаление списка"
							text="Вы уверены, что хотите удалить список задач? Вернуть его будет невозможно!"
							onCancelled={() => {}}
							onConfirmed={async () => {
								let result = await deleteStore.mutate({
									input: {
										eventId: eventId,
										checklistId: initialChecklist.id,
									},
								});

								if (result.data?.deleteChecklist?.gqlEvent) {
									modal.close();
									return;
								}
							}}
						>
							<div class="btn btn-xs btn-error btn-outline" role="button">
								<Trash size={20} />
							</div>
						</WithConfirmation>
					{/if}
				</div>
			</div>
		</div>
		<LabeledInput
			id="title"
			name="title"
			bind:value={checklist.title}
			label="Название"
			type="text"
			labelClass="w-min col-span-1 max-sm:col-span-5"
			inputClass="w-full bg-primary/15 col-span-4 max-sm:col-span-5 input-sm"
		/>
		<div class="max-sm:hidden"></div>
		<div class="col-span-4 max-sm:col-span-5 max-sm:px-5 text-sm">
			<ValidationErrorsList
				errors={validationErrors?.filter(
					(x) =>
						x.propertyName ===
						"EventChanges.Checklists.Value[0].Title",
				)}
			/>
		</div>
		<span class="col-span-5">Задачи:</span>
		{#each checklist.items as _, i}
			<div class="col-span-5 flex flex-row items-center gap-1">
				<span>{i + 1}.</span>
				<input
					type="checkbox"
					class="checkbox checkbox-primary"
					bind:checked={checklist.items[i].done}
				/>
				<input
					type="text"
					class="input input-bordered input-xs w-full"
					bind:value={checklist.items[i].title}
				/>
				<button
					class="btn btn-xs"
					onclick={() => {
						checklist.items.splice(i, 1);
					}}>x</button
				>
			</div>
			<div class="col-span-5 px-5 text-sm">
				<ValidationErrorsList
					errors={validationErrors?.filter(
						(x) =>
							x.propertyName ===
							`EventChanges.Checklists.Value[0].ChecklistItems[${i}].Title`,
					)}
				/>
			</div>
		{/each}
		<button
			class="btn btn-sm btn-primary btn-outline col-span-5"
			onclick={() => {
				checklist.items.push({
					done: false,
					title: "",
				});
			}}
		>
			<span class="font-bold text-lg">+</span>
			Добавить задачу
		</button>
	</form>
</Modal>
