<script lang="ts">
	import Collapse from "./Collapse.svelte";
	import SaveGuestModal from "./Modals/SaveGuestModal.svelte";
	import type { EventModel } from "./controls/eventsModel";
	import Edit from "./icons/Edit.svelte";
	import Person from "./icons/Person.svelte";

	let { event } = $props<{ event: EventModel }>();

	let guests = $derived(event.guests);
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
		<div class="flex flex-col w-full items-start">
			<SaveGuestModal eventId={event.id}>
				<button
					type="button"
					class="btn btn-primary btn-outline text-xs font-bold btn-sm"
				>
					<span class="text-xl">+</span>
					<span>Добавить гостя</span>
				</button>
			</SaveGuestModal>
		</div>
		<div class="divider mt-0"></div>
		{#if guests.length > 0}
			<div class="overflow-x-auto">
				<table class="table">
					<!-- head -->
					<thead>
						<tr>
							<th>Гость</th>
							<th>Теги</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each guests as g}
							<!-- row 1 -->
							<tr>
								<td class="">
									<div class="flex items-center gap-3">
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
													<Person size={30}/>
												{/if}
											</div>
										</div>
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
