#!/usr/bin/env bash
# Einmalige Einrichtung in Google Cloud Shell als Projektadministrator ausführen.
# Berechtigt GitHub Actions zu Firebase-Deployments ausschließlich in linienimperium.
# Erteilt dem Deployment-Dienstkonto Firebase Admin und Service Account User
# im Spielprojekt. Keine Owner-Rolle, keine privaten Dienstkontoschlüssel.
set -euo pipefail

LI_PROJECT="linienimperium"
LI_POOL="linienimperium-github"
LI_PROVIDER="mobile-main"
LI_ACCOUNT_ID="github-mobile-deploy"
LI_ACCOUNT="${LI_ACCOUNT_ID}@${LI_PROJECT}.iam.gserviceaccount.com"
LI_REPOSITORY_ID="1421135448"
LI_OWNER_ID="266092295"
LI_CONDITION="assertion.repository_id == '${LI_REPOSITORY_ID}' && assertion.repository_owner_id == '${LI_OWNER_ID}' && assertion.ref == 'refs/heads/main'"

gcloud projects describe "$LI_PROJECT" --format="value(projectId)"
LI_NUMBER="$(gcloud projects describe "$LI_PROJECT" --format='value(projectNumber)')"

gcloud services enable iam.googleapis.com iamcredentials.googleapis.com \
  sts.googleapis.com firebase.googleapis.com firebaserules.googleapis.com \
  firestore.googleapis.com cloudfunctions.googleapis.com cloudbuild.googleapis.com \
  artifactregistry.googleapis.com run.googleapis.com eventarc.googleapis.com \
  --project="$LI_PROJECT"

if ! gcloud iam service-accounts describe "$LI_ACCOUNT" --project="$LI_PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$LI_ACCOUNT_ID" \
    --display-name="LinienImperium Mobile GitHub deployment" --project="$LI_PROJECT"
fi

if ! gcloud iam workload-identity-pools describe "$LI_POOL" \
  --location=global --project="$LI_PROJECT" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools create "$LI_POOL" --location=global \
    --display-name="LinienImperium GitHub Actions" --project="$LI_PROJECT"
fi

if gcloud iam workload-identity-pools providers describe "$LI_PROVIDER" \
  --workload-identity-pool="$LI_POOL" --location=global \
  --project="$LI_PROJECT" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers update-oidc "$LI_PROVIDER" \
    --workload-identity-pool="$LI_POOL" --location=global --project="$LI_PROJECT" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository_id=assertion.repository_id" \
    --attribute-condition="$LI_CONDITION"
else
  gcloud iam workload-identity-pools providers create-oidc "$LI_PROVIDER" \
    --workload-identity-pool="$LI_POOL" --location=global --project="$LI_PROJECT" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository_id=assertion.repository_id" \
    --attribute-condition="$LI_CONDITION"
fi

gcloud iam service-accounts add-iam-policy-binding "$LI_ACCOUNT" \
  --project="$LI_PROJECT" --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${LI_NUMBER}/locations/global/workloadIdentityPools/${LI_POOL}/attribute.repository_id/${LI_REPOSITORY_ID}"

for LI_ROLE in roles/firebase.admin roles/iam.serviceAccountUser; do
  gcloud projects add-iam-policy-binding "$LI_PROJECT" \
    --member="serviceAccount:${LI_ACCOUNT}" --role="$LI_ROLE" --condition=None
done

printf '\nEinrichtung abgeschlossen. Diese Angaben enthalten keine geheimen Schlüssel:\n'
printf 'GCP_WORKLOAD_IDENTITY_PROVIDER=projects/%s/locations/global/workloadIdentityPools/%s/providers/%s\n' "$LI_NUMBER" "$LI_POOL" "$LI_PROVIDER"
printf 'GCP_SERVICE_ACCOUNT=%s\n' "$LI_ACCOUNT"
printf '\nGitHub-Variablen: https://github.com/CornerDesign-Dominic/LinienImperiumMobile/settings/variables/actions\n'
printf 'IAM-Änderungen können einige Minuten benötigen. Noch keine App oder Functions veröffentlicht.\n'
