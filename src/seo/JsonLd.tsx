import React from "react";
import { Helmet } from "react-helmet-async";

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown> | null> | null;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  if (!data) return null;

  const cleanData = Array.isArray(data)
    ? data.filter((item): item is Record<string, unknown> => item !== null && item !== undefined)
    : data;

  if (Array.isArray(cleanData) && cleanData.length === 0) return null;

  const jsonString = JSON.stringify(cleanData).replace(/</g, "\\u003c");

  return (
    <Helmet>
      <script type="application/ld+json">{jsonString}</script>
    </Helmet>
  );
};

export default JsonLd;
