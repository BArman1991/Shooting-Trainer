"use client";

import React from "react";
import { useParams } from "next/navigation";
import DrillEditor from "../../../components/custom/DrillEditor";

export default function EditDrillPage() {
  const params = useParams();
  const drillId = params.id as string;

  return <DrillEditor drillId={drillId} />;
}
