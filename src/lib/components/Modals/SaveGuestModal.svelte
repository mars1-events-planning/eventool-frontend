<script lang="ts">
	import { graphql } from "$houdini";
	import SuccessPopup from "../SuccessPopup.svelte";
	import LabeledInput from "../controls/LabeledInput.svelte";
	import type { Checklist, Guest } from "../controls/eventsModel";
	import Trash from "../icons/Trash.svelte";
	import Confirm from "../icons/Confirm.svelte";
	import Modal from "./Modal.svelte";
	import WithConfirmation from "./WithConfirmation.svelte";

	let { initialGuest, eventId } = $props<{
		initialGuest?: Guest;
		eventId: string;
	}>();

	let success: boolean | undefined = $state(false);
	let guest: Guest = $state(null!);

	const reset = () => {
		guest =
			initialGuest ??
			({
				id: null!,
				name: "",
				contact: "",
				tags: [],
			} as Guest);
		success = undefined;
	};

	$effect.pre(() => {
		reset();
	});

	let tag = $state("");
	let guestTags: string[] = $state(initialGuest?.tags ?? []);

	let store = graphql(`
		mutation SaveGuest($input: SaveEventInput!) {
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
					guests {
						id
						name
						contact
						tags
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
		mutation DeleteGuest($input: DeleteGuestInput!) {
			deleteGuest(input: $input) {
				gqlEvent {
					id
					guests {
						id
						name
						contact
						tags
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

	let modal: Modal;
</script>

<Modal title="Сохранить гостя" onClose={() => reset()} bind:this={modal}>
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
						onclick={async () => {
							let result = await store.mutate({
								input: {
									input: {
										eventId: eventId,
										guests: {
											id: guest.id,
											name: guest.name,
											contact: guest.contact,
											tags: guestTags,
										},
									},
								},
							});

							if (result.data?.saveEvent?.gqlEvent) {
								success = true;
								return;
							}
							success = false;
						}}
					>
						<Confirm size={20} />
					</button>
					{#if initialGuest}
						<WithConfirmation
							title="Удаление гостя"
							text="Вы уверены что хотите удалить гостя? Восстановить его будет невозможно!"
							onCancelled={() => {}}
							onConfirmed={async () => {
								let result = await deleteStore.mutate({
									input: {
										eventId: eventId,
										guestId: initialGuest.id,
									},
								});

								if (result.data?.deleteGuest?.gqlEvent) {
									modal.close();
									return;
								}
							}}
						>
							<button class="btn btn-xs btn-error btn-outline">
								<Trash size={15} />
							</button>
						</WithConfirmation>
					{/if}
				</div>
			</div>
		</div>
		<LabeledInput
			id="name"
			name="name"
			bind:value={guest.name}
			label="Имя"
			type="text"
			labelClass="w-min col-span-1 max-sm:col-span-5"
			inputClass="w-full bg-primary/15 col-span-4 max-sm:col-span-5 input-sm"
		/>
		<LabeledInput
			id="contact"
			name="contact"
			bind:value={guest.contact}
			label="Контакт"
			type="text"
			labelClass="w-min col-span-1 max-sm:col-span-5"
			inputClass="w-full bg-primary/15 col-span-4 max-sm:col-span-5 input-sm"
		/>
		<LabeledInput
			id="tag"
			name="tag"
			bind:value={tag}
			label="Тег"
			type="text"
			labelClass="w-min col-span-1 max-sm:col-span-5"
			inputClass="w-full bg-primary/15 col-span-3 max-sm:col-span-5 input-sm"
		/>
		<button
			class="btn btn-sm btn-primary btn-outline col-span-1"
			onclick={() => {
				guestTags.push(tag);
				tag = "";
			}}
		>
			<span class="font-bold text-lg">+</span>
		</button>
		<div class="divider col-span-5 m-0"></div>
		<div class="col-span-5 flex flex-wrap gap-2">
			{#if guestTags.length > 0}
				{#each guestTags as guestTag}
					<button
						class="badge badge-ghost badge-sm cursor-pointer"
						onclick={() => {
							guestTags = guestTags.filter((e) => e !== guestTag);
						}}
					>
						{guestTag}&nbsp;x
					</button>
				{/each}
			{:else}
				Тегов пока нет
			{/if}
		</div>

		{#if success}
			<div class="flex flex-col col-span-5 items-center justify-center">
				<SuccessPopup />
			</div>
		{/if}
	</form>
</Modal>
