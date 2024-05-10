<script lang="ts">
	import Collapse from "./Collapse.svelte";
	import ImagePicker from "./Modals/ImagePicker.svelte";
    import type { EventModel } from "./controls/eventsModel";

	let { event } = $props<{
		event: EventModel
	}>()

	let onImageSubmit = async (file: File) => {
		const formData = new FormData();
  		formData.append('image', file);
		formData.append('eventId', event.id);

		// Make the POST request to upload the avatar
		const response = await fetch('https://backend.eventool.online/api/add-event-image', {
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
	}
</script>

<Collapse checked>
	<span slot="title" class="font-semibold">Галерея</span>
	<div slot="content" class="flex flex-col">
		<div class="divider divider-end">
			<div class="flex flex-row items-end">
				<ImagePicker onSubmit={onImageSubmit}>
					<div
						class="btn btn-primary btn-outline text-xs font-bold btn-xs"
					>
						<span class="text-base">+</span>
					</div>
				</ImagePicker>
			</div>
		</div>
		<div class="carousel carousel-center rounded-box">
			{#each event.photos as img}
				<div class="carousel-item max-w-72">
					<img src={img} alt="EventImage" />
				</div>
			{/each}
		</div>
	</div>
</Collapse>
