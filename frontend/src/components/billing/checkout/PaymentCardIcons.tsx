const cards = [
  "VISA",
  "MC",
  "AMEX",
];

export default function PaymentCardIcons() {
  return (
    <div className="flex gap-1.5">
      {cards.map((card) => (
        <div
          key={card}
          className="flex h-6 w-10 items-center justify-center rounded-lg border border-[#e6edf9] bg-[#fbfcff] text-[8px] font-black text-[#565e74]"
        >
          {card}
        </div>
      ))}
    </div>
  );
}