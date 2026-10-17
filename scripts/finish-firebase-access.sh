#!/usr/bin/env bash
# Einmal in Google Cloud Shell als Projektinhaber ausführen.
# Ergänzt die APIs und eng begrenzten Zugriffe für den ersten Mobile-Build.
set -euo pipefail
LI_PROJECT=linienimperium
LI_DEPLOY=github-mobile-deploy@linienimperium.iam.gserviceaccount.com
LI_RUNTIME=mobile-game-runtime@linienimperium.iam.gserviceaccount.com
LI_SECRET=linienimperium-android-preview-signing
LI_NUMBER="$(gcloud projects describe "$LI_PROJECT" --format='value(projectNumber)')"
gcloud services enable cloudbilling.googleapis.com firebaseextensions.googleapis.com \
  secretmanager.googleapis.com pubsub.googleapis.com storage.googleapis.com \
  --project="$LI_PROJECT"
if ! gcloud iam service-accounts describe "$LI_RUNTIME" --project="$LI_PROJECT" >/dev/null 2>&1; then
  gcloud iam service-accounts create mobile-game-runtime \
    --display-name='LinienImperium game server' --project="$LI_PROJECT"
fi
gcloud projects add-iam-policy-binding "$LI_PROJECT" \
  --member="serviceAccount:$LI_RUNTIME" --role=roles/datastore.user --condition=None
# Google verwendet bei neuen Projekten dieses Konto für Cloud-Functions-Builds.
gcloud projects add-iam-policy-binding "$LI_PROJECT" \
  --member="serviceAccount:${LI_NUMBER}-compute@developer.gserviceaccount.com" \
  --role=roles/cloudbuild.builds.builder --condition=None
if ! gcloud secrets describe "$LI_SECRET" --project="$LI_PROJECT" >/dev/null 2>&1; then
  gcloud secrets create "$LI_SECRET" --replication-policy=automatic --project="$LI_PROJECT"
fi
for LI_ROLE in roles/secretmanager.secretAccessor roles/secretmanager.secretVersionAdder; do
  gcloud secrets add-iam-policy-binding "$LI_SECRET" --project="$LI_PROJECT" \
    --member="serviceAccount:$LI_DEPLOY" --role="$LI_ROLE" --condition=None
done
printf '\nMobile-Deployment vorbereitet. Keine privaten Schlüssel ausgegeben.\n'
printf 'Jetzt GitHub Actions → Mobile preview → Run workflow starten.\n'
