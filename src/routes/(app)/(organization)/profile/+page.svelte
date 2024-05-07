<script lang="ts">
	import { graphql } from "$houdini";
	import AvatarPlaceholder from "$lib/components/AvatarPlaceholder.svelte";
	import Collapse from "$lib/components/Collapse.svelte";
	import ChangePassword from "$lib/components/Modals/ChangePassword.svelte";
	import WithConfirmation from "$lib/components/Modals/WithConfirmation.svelte";
	import LabeledInput from "$lib/components/controls/LabeledInput.svelte";
	import ValidationErrorsList from "$lib/components/controls/ValidationErrorsList.svelte";
	import Confirm from "$lib/components/icons/Confirm.svelte";
    import Password from "$lib/components/icons/Password.svelte";
    import Photo from "$lib/components/icons/Photo.svelte";
	import Trash from "$lib/components/icons/Trash.svelte";

	const currentOrganizerDataStore = graphql(`
		query GetCurrentOrganizerData {
			organizer {
				id
				fullname
				username
			}
		}
	`);

	let editStore = graphql(`
		mutation EditOrganizer($input: EditOrganizerInput!) {
			editOrganizer(input: $input) {
				organizer {
					id
					fullname
					username
				}
				errors {
					code: __typename
					... on Error {
						message
					}
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

	let initialFullname = $state("");
	let initialUsername = $state("");
	let fullname = $state("");
	let username = $state("");
	let validationErrors = $derived(
		$editStore.data?.editOrganizer?.errors
			?.filter((error) => error.code === "ValidationError")
			?.flatMap((error) => error.errors)
			?.map((error) => error!) ?? [],
	);

	$effect.pre(() => {
		currentOrganizerDataStore.fetch().then((data) => {
			initialFullname = data.data?.organizer?.fullname ?? "";
			initialUsername = data.data?.organizer?.username ?? "";
			fullname = initialFullname;
			username = initialUsername;
		});
	});

</script>

<div
	class="flex flex-col justify-center max-w-fit items-center place-self-center"
>
	<Collapse checked canBeClosed={false}>
		<span slot="title" class="font-semibold">Редактирование профиля</span>
		<div slot="content" class="flex flex-col">
			<div class="divider divider-end">
				<div class="flex flex-row-reverse gap-2">
					<button
						type="button"
						class="btn btn-primary btn-xs col-span-5"
						onclick={async () => {
							let result = await editStore.mutate({
								input: {
									fullName:
										fullname === initialFullname
											? undefined
											: fullname,
									username:
										username === initialUsername
											? undefined
											: username,
								},
							});

							if (result.data?.editOrganizer?.organizer) {
								mutationSuccess = true;
								return;
							}

							mutationSuccess = false;
						}}
					>
						<Confirm size={15} />
					</button>

					<ChangePassword>
						<div
							class="btn btn-outline text-xs font-bold btn-xs w-full"
						>
							<Password size={15} />
						</div>
					</ChangePassword>

					<button class="btn btn-neutral btn-outline btn-xs">
						<Photo size={15} />
					</button>

					<WithConfirmation
						title="Удалить профиль"
						text="Вы уверены что хотите удалить профиль? Восстановить его будет невозможно!"
						onCancelled={() => {}}
						onConfirmed={async () => {}}
					>
						<div class="btn btn-error btn-outline btn-xs" role="button">
							<Trash size={15} />
						</div>
					</WithConfirmation>
				</div>
			</div>
			<form class="flex items-center flex-row gap-4 w-max">
				<AvatarPlaceholder
					avatarClasses="rounded-lg p-2 aspect-square w-[35%]"
				>
					<span class="text-4xl"
						>{initialFullname.slice(0, 2).toUpperCase()}</span
					>
				</AvatarPlaceholder>
				<div class="flex-grow grid grid-cols-5 gap-4 w-fit">
					<div class="grid grid-cols-subgrid col-span-5 items-center">
						<LabeledInput
							id="username"
							name="username"
							bind:value={username}
							label="Логин:"
							type="text"
							labelClass="w-min col-span-1"
							inputClass="w-full col-span-4 bg-primary/15"
						/>
						<div></div>
						<div class="col-span-4 break-all">
							<ValidationErrorsList
								errors={validationErrors?.filter(
									(x) => x.propertyName === "Username",
								)}
							/>
						</div>
					</div>

					<div class="grid grid-cols-subgrid col-span-5 items-center">
						<LabeledInput
							id="fullname"
							name="fullname"
							bind:value={fullname}
							label="Имя:"
							type="text"
							labelClass="w-min col-span-1"
							inputClass="w-full col-span-4 bg-primary/15"
						/>
						<div></div>
						<div class="col-span-4">
							<ValidationErrorsList
								errors={validationErrors?.filter(
									(x) => x.propertyName === "Fullname",
								)}
							/>
						</div>
					</div>
				</div>
			</form>
		</div>
	</Collapse>
</div>
