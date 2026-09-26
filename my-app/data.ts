export type DummyItem = {
  name: string;
  img: string;
  points: string;
};

export const data: DummyItem[] = Array.from({ length: 100 }, (_, index) => ({
  name: `utencils-${index + 1}`,
  img: "/images/img1.png",
  points: "200",
}));