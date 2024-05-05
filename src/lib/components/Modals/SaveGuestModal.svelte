<script lang="ts">
	import { graphql } from "$houdini";
	import SuccessPopup from "../SuccessPopup.svelte";
	import LabeledInput from "../controls/LabeledInput.svelte";
	import type { Checklist, Guest } from "../controls/eventsModel";
	import Modal from "./Modal.svelte";

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
	let guestTags: string[] = $state(initialGuest?.tags ?? [])

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
</script>

<Modal title="Сохранить гостя" onClose={() => reset()}>
	<div slot="button">
		<slot />
	</div>

	<form slot="content" class="grid grid-cols-5 gap-2 items-center w-full">
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
			{#each guestTags as guestTag}
				<button class="badge badge-ghost badge-xs cursor-pointer" onclick={() => {
					guestTags = guestTags.filter(e => e !== guestTag);
				}}>
					{guestTag}&nbsp;x
				</button>
			{/each}
		</div>
		<br />
		<button
			type="button"
			class="btn col-span-5 btn-primary w-full"
			disabled={guest.name.trim().length === 0}
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
			Сохранить
		</button>
		{#if success}
			<div class="flex flex-col col-span-5 items-center justify-center">
				<SuccessPopup />
			</div>
		{/if}
	</form>
</Modal>
