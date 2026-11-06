import { useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PaymentCardItem from "./PaymentCardItem";
import {
	fetchCards,
	deleteCard,
	setDefaultCard,
	type SavedCard,
} from "./CardHelper";
import { getCurrentUserId } from "../../../utils/currentUser";

type SavedCardsProps = {
	selectedCard: SavedCard | null;
	setSelectedCard: (card: SavedCard | null) => void;
};

function SavedCards({ selectedCard, setSelectedCard }: SavedCardsProps) {
	const queryClient = useQueryClient();
	const userId = getCurrentUserId();
	const cardQuery = useQuery({
		queryKey: ["cards", userId],
		queryFn: fetchCards,
		enabled: userId !== null,
	});
	const cards: SavedCard[] = useMemo(() => cardQuery.data?.cards ?? [], [cardQuery.data]);
	const defaultCardId = cardQuery.data?.defaultCardId ?? null;

	// pre-select the default card if no card is selected
	useEffect(() => {
		if (selectedCard) return;
		const defaultCard = cards.find((card) => card.id === defaultCardId);
		if (defaultCard) setSelectedCard(defaultCard);
	}, [cards, defaultCardId, selectedCard, setSelectedCard]);

	const deleteCardMutation = useMutation({
		mutationFn: (id: string) => deleteCard(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cards"] });
		},
	});

	const setDefaultCardMutation = useMutation({
		mutationFn: (id: string) => setDefaultCard(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cards"] });
		},
	});

	if (cards.length === 0) return null;

	return (
		<div className="flex flex-col gap-space-md">
			<div className="flex items-center gap-space-sm">
				<span className="h-6 w-2.5 rounded-full bg-primary" />
				<h3 className="font-title-md text-title-md font-bold text-on-surface">
					Saved Cards
				</h3>
			</div>

			{cards.map((card) => (
				<PaymentCardItem
					key={card.id}
					card={card}
					isDefault={card.id === defaultCardId}
					isSelected={selectedCard?.id === card.id}
					onSelect={() => setSelectedCard(card)}
					onDelete={() => deleteCardMutation.mutate(card.id)}
					onSetDefault={() => setDefaultCardMutation.mutate(card.id)}
				/>
			))}
		</div>
	);
}

export default SavedCards;
