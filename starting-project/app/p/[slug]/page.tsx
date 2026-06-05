export default function PublicNotePage({ params }: { params: { slug: string } }) {
  return <p>Public note — slug: {params.slug}</p>;
}
