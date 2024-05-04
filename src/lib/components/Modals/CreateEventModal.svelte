<script>
	import { goto } from "$app/navigation";
	import { graphql } from "$houdini";
	import LabeledInput from "../controls/LabeledInput.svelte";
	import Create from "../icons/Create.svelte";
	import Modal from "./Modal.svelte";

	let title = $state("");

	let store = graphql(`
		mutation CreateEvent($input: SaveEventInput!) {
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
				}
				errors {
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

<Modal title="Создать мероприятие">
	<div slot="button">
		<slot />
	</div>

	<form slot="content" class="grid grid-cols-5 gap-2 items-center">
		<LabeledInput
			id="title"
			name="title"
			bind:value={title}
			label="Название"
			type="text"
			labelClass="w-min col-span-5"
			inputClass="w-full bg-primary/15 col-span-4 max-[330px]:col-span-5 max-[320px]:input-sm"
		/>
		<button
			type="button"
			class="btn btn-primary w-full max-[330px]:col-span-5 max-[320px]:btn-sm"
			disabled={title.trim().length === 0}
			onclick={async () => {
				let result = await store.mutate({
					input: {
						input: {
							title: title,
						},
					},
				});

				if (!result.data?.saveEvent?.errors) {
					await goto(
						`event/${result.data?.saveEvent.gqlEvent?.id}/edit`,
					);
				}
			}}
		>
			Создать
		</button>
	</form>
</Modal>
