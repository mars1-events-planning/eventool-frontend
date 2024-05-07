<script lang="ts">
	import { page } from "$app/stores";
	import { graphql } from "$houdini";
	import Authorized from "$lib/components/Authorized.svelte";
    import EventGallery from "$lib/components/EventGallery.svelte";
	import EventGuests from "$lib/components/EventGuests.svelte";
	import EventMetadata from "$lib/components/EventMetadata.svelte";
	import EventTasks from "$lib/components/EventTasks.svelte";
	import Preloader from "$lib/components/icons/Preloader.svelte";

	const eventStore = graphql(`
		query GetEventById($eventId: String!) {
			event(eventId: $eventId) {
				id
				title
				address
				description
				startAtUtc
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
		}
	`);

	$effect.pre(() => {
		eventStore.fetch({ variables: { eventId: $page.params.id } });
	});

	let event = $derived($eventStore.data?.event!);
</script>

<Authorized>
	{#if $eventStore.fetching}
		<Preloader />
	{:else if event}
		<div class="flex flex-col gap-5 max-lg:items-center">
			<EventMetadata {event} />
			<EventGallery />
			<EventGuests {event} />
			<EventTasks {event} />
		</div>
	{/if}
</Authorized>
