import { getAdminCertificates } from "@/app/actions/admin";
import CertificatesClient from "./CertificatesClient";

export default async function CertificatesPage() {
  const certificates = await getAdminCertificates();
  return <CertificatesClient initialCertificates={certificates} />;
}

