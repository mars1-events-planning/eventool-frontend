<script lang="ts">
	import Collapse from "./Collapse.svelte";
	import ImagePicker from "./Modals/ImagePicker.svelte";
	import SaveGuestModal from "./Modals/SaveGuestModal.svelte";
	import type { EventModel } from "./controls/eventsModel";
	import Edit from "./icons/Edit.svelte";
	import Person from "./icons/Person.svelte";

	let { event } = $props<{ event: EventModel }>();

	let guests = $derived(event.guests);

	let imageSubmitFactory = (guestId: string) => {
		return async (file: File) => {
			const formData = new FormData();
			formData.append('image', file);
			formData.append('eventId', event.id);
			formData.append('guestId', guestId);

			// Make the POST request to upload the avatar
			const response = await fetch('https://backend.eventool.online/api/set-guest-avatar', {
				method: 'POST',
				body: formData,
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
				},
				credentials: 'include'
			});

			if (!response.ok) {
				const errorMessage = await response.text();
				throw new Error(errorMessage);
			}

			// Handle the response from the server
			const result = await response.json();
			console.log('Avatar uploaded successfully:', result);

			return result;
		}
	}
</script>

<Collapse>
	<div slot="title" class="flex flex-row justify-between">
		<span class="font-semibold">Гости</span>
		<div class="flex flex-row content-center items-center text-primary">
			<Person size={20} />
			{guests.length}
		</div>
	</div>
	<div slot="content" class="overflow-x-auto">
		<div class="divider divider-end">
			<div class="flex flex-col items-end">
				<SaveGuestModal eventId={event.id}>
					<div
						class="btn btn-primary btn-outline text-xs font-bold btn-xs"
					>
						<span class="text-base">+</span>
				</div>
				</SaveGuestModal>
			</div>
		</div>
		{#if guests.length > 0}
			<div class="overflow-x-auto overflow-y-scroll max-h-[400px]">
				<table class="table table-pin-rows">
					<!-- head -->
					<thead class="">
						<tr class="shadow-md">
							<th>Гость</th>
							<th>Теги</th>
							<th></th>
						</tr>
					</thead>
					<tbody class="">
						{#each guests as g (g.id)}
							<tr>
								<td class="">
									<div class="flex items-center gap-3">
										<ImagePicker onSubmit={async (f)=>{await imageSubmitFactory(g.id)(f)}} id={g.id}>
											<div class="avatar">
												<div
													class="mask mask-squircle w-12 h-12"
												>
													{#if g.photoUrl}
														<img
															src={g.photoUrl}
															alt="avatar"
														/>
													{:else}
														<Person size={30} />
													{/if}
												</div>
											</div>
										</ImagePicker>
										<div>
											<div class="font-bold">
												{g.name}
											</div>
											<div class="text-sm opacity-50">
												{g.contact}
											</div>
										</div>
									</div>
								</td>
								<td>
									<div class="flex flex-wrap gap-2">
										{#each g.tags as tag}
											<span
												class="badge badge-ghost badge-xs"
											>
												{tag}
											</span>
										{/each}
									</div>
								</td>
								<td>
									<div
										class="flex flex-row-reverse items-center"
									>
										<SaveGuestModal
											initialGuest={g}
											eventId={event.id}
										>
											<button
												type="button"
												class="btn btn-primary btn-outline text-xs font-bold btn-xs"
											>
												<Edit size={20} />
											</button>
										</SaveGuestModal>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<span>Гостей пока нет</span>
		{/if}
	</div>
</Collapse>
