export default function SplitHeading({ lines, className = "", as: Tag = "h2" }) {
  return (
    <Tag className={`ven-line-reveal overflow-hidden ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <span className="ven-line inline-block">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
