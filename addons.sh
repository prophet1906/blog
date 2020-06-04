# Configure minikube docker env
eval $(minikube -p minikube docker-env)

# enable ingress addon
minikube addons enable ingress

# check kube system for ingress pods
watch kubectl get pods -n kube-system
