import ReactMarkdown from "react-markdown";

interface IMarkdownProps {
  content: string;
}

const MarkdownRenderer = (props: IMarkdownProps) => {
  return <ReactMarkdown>{props.content}</ReactMarkdown>;
};

export default MarkdownRenderer;
