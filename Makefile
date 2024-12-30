.EXPORT_ALL_VARIABLES:

AWS_PROFILE=rekha-ai
FRONTEND_DIR := packages/frontend
BACKEND_DIR := packages/backend
REGION := us-east-2

bootstrap-backend:
	echo "Bootstrapping CDK for backend...👢"
	cd $(BACKEND_DIR) && cdk bootstrap --profile $(AWS_PROFILE)

deploy-backend:
	echo "Deploying backend... 🚀"
	cd $(BACKEND_DIR) && cdk deploy --require-approval never --all --profile $(AWS_PROFILE)

docker-login:
	aws  ecr-public get-login-password --region us-east-1 --profile ${AWS_PROFILE} | docker login --username AWS --password-stdin public.ecr.aws
