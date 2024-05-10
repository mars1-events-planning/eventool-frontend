<script lang="ts">
    import { formatDateString } from "$lib/utils";
    import Modal from "./Modal.svelte";
    import Confirm from "$lib/components/icons/Confirm.svelte";
    import Edit from "../icons/Edit.svelte";
    import WithConfirmation from "./WithConfirmation.svelte";
    import Trash from "../icons/Trash.svelte";
    import Note from "../icons/Note.svelte";

    let notes = [
        {
            id: "e0b8ebfc-321f-4cf0-a4f7-77e5b4aad529",
            text: "Meeting notes on project X. Meeting notes on project X. Meeting notes on project X. Meeting notes on project X. Meeting notes on project X. Meeting notes on project X. Meeting notes on project X. Meeting notes on project X.",
            organizerId: "a12b22f5-abc2-46c2-94d2-111222333444",
            createdAt: "2023-10-01T13:20:14Z",
            changedAt: "2023-10-02T15:30:20Z",
            images: [
                "https://example.com/image1.jpg",
                "https://example.com/image2.jpg",
                "https://example.com/image2.jpg",
                "https://example.com/image2.jpg",
                "https://example.com/image2.jpg",
                "https://example.com/image2.jpg",
                "https://example.com/image2.jpg",
            ],
        },
        {
            id: "b1c92fae-2c1d-4eaa-b8fa-c1d2e2d3f4g5",
            text: "Budget review and adjustments.",
            organizerId: "c12d34f5-e6f7-48c2-91a2-345678901234",
            createdAt: "2023-09-25T09:45:00Z",
            changedAt: "2023-09-28T10:00:00Z",
            images: [
                "https://example.com/image3.jpg",
                "https://example.com/image4.jpg",
            ],
        },
        {
            id: "b1c92fae-2c1d-4eaa-b8fa-c1d2e2d3f4g5",
            text: "Budget review and adjustments.",
            organizerId: "c12d34f5-e6f7-48c2-91a2-345678901234",
            createdAt: "2023-09-25T09:45:00Z",
            changedAt: "2023-09-28T10:00:00Z",
            images: [],
        },
    ];

    let modal: Modal;
</script>

<Modal title="Заметки" bind:this={modal}>
    <div slot="button">
        <slot />
    </div>

    <div
        slot="content"
        class="flex flex-col gap-4 min-w-[75vw] min-h-[85vh] p-5"
    >
        <div class="divider m-0 divider-end">
            <div class="flex flex-row-reverse gap-4">
                <button type="button" class="btn btn-xs btn-primary">
                    <Confirm size={20} />
                </button>
            </div>
        </div>

        <div class="flex flex-col gap-8">
            {#each notes as note, i}
                {@const createdAt = formatDateString(note.createdAt)}
                {@const changedAt = formatDateString(note.changedAt)}
                <div class="flex flex-row gap-2 min-h-[100px]">
                    <div class="flex flex-col items-end gap-2">
                        <span class="text-xl">{i + 1}</span>
                        <span class="text-xs">
                            Создано: <span class="font-mono font-thin pl-1">
                                {createdAt}</span
                            >
                        </span>
                        <span class="text-xs">
                            Изменено: <span class="font-mono font-thin pl-1">
                                {changedAt}</span
                            >
                        </span>
                    </div>
                    <div class="divider divider-horizontal divider-end">
                        <div class="flex flex-col items-center gap-2">
                            <button class="btn btn-neutral btn-outline btn-xs">
                                <Edit size={15} />
                            </button>
                            <WithConfirmation
                                title="Удалить событие"
                                text="Вы уверены что хотите удалить событие? Восстановить его будет невозможно!"
                                onCancelled={() => {}}
                                onConfirmed={() => {}}
                            >
                                <div
                                    class="btn btn-error btn-outline btn-xs"
                                    role="button"
                                >
                                    <Trash size={15} />
                                </div>
                            </WithConfirmation>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 max-w-[50vw] w-full">
                        <span class=" whitespace-break-spaces">{note.text}</span
                        >
                        <div class="flex flex-wrap gap-4 w-full">
                            {#each note.images as img}
                                <div class="max-w-32">
                                    <img
                                        src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg"
                                        alt="note img"
                                        class="rounded-box"
                                    />
                                </div>
                            {/each}
                            {#if note.images.length < 10}
                                <button
                                    class="btn btn-outline btn-primary max-w-32 w-full"
                                >
                                    <span class="text-xl">+</span>
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</Modal>
