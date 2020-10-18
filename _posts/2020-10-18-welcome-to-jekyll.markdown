---
layout: post
title:  "Local Kubernetes Cluster With KIND"
date:   2020-10-18 18:15:08 -0400
categories: kubernetes
---

- [Prerequisite](#prerequisite)
- [Create Local Kubernetes Cluster](#create-local-kubernetes-cluster)
- [Verify Cluster Installation](#verify-cluster-installation)
- [Delete Local Kubernete Cluster](#delete-local-kubernetes-cluster)

## Prerequisite
* kubectl: <https://kubernetes.io/docs/tasks/tools/install-kubectl/>
* docker: <https://docs.docker.com/get-docker/>
* kind: <https://kind.sigs.k8s.io/docs/user/quick-start/>

```bash
#!/bin/sh

# install docker (debian distro): 
# https://docs.docker.com/engine/install/debian/
sudo apt-get remove docker docker-engine docker.io containerd runc
sudo apt-get update
sudo apt-get install -y \
    apt-transport-https ca-certificates curl \
    gnupg-agent software-properties-common

curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
sudo add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/debian \
  $(lsb_release -cs) \
  stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
# add current user to docker group
sudo usermod -aG docker $USER
newgrp docker

# install kubectl: 
# https://kubernetes.io/docs/tasks/tools/install-kubectl/
# make sure kubectl version is compatible with kind version
curl -LO https://storage.googleapis.com/kubernetes-release/release/v1.19.0/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl

# install kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.9.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```


## Create Local Kubernetes Cluster

Following `kind` [user guide](https://kind.sigs.k8s.io/docs/user/quick-start/), to creat the cluster with:
1. local docker registry
2. ingress support
3. host to node port mapping

We can modify [examples/kind-with-registry.sh](https://raw.githubusercontent.com/kubernetes-sigs/kind/master/site/static/examples/kind-with-registry.sh):

```bash
#!/bin/sh
set -o errexit

# create registry container unless it already exists
reg_name='kind-registry'
reg_port='5000'
running="$(docker inspect -f '{{.State.Running}}' "${reg_name}" 2>/dev/null || true)"
if [ "${running}" != 'true' ]; then
  docker run \
    -d --restart=always -p "${reg_port}:5000" --name "${reg_name}" \
    registry:2
fi

# create a cluster with the local registry enabled in containerd
cat <<EOF | kind create cluster --config=-
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
containerdConfigPatches:
- |-
  [plugins."io.containerd.grpc.v1.cri".registry.mirrors."localhost:${reg_port}"]
    endpoint = ["http://${reg_name}:${reg_port}"]
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        # node label to enable ingress support
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 8080
    protocol: TCP
  - containerPort: 443
    hostPort: 8443
    protocol: TCP
EOF

# connect the registry to the cluster network
docker network connect "kind" "${reg_name}"

# tell https://tilt.dev to use the registry
# https://docs.tilt.dev/choosing_clusters.html#discovering-the-registry
for node in $(kind get nodes); do
  kubectl annotate node "${node}" "kind.x-k8s.io/registry=localhost:${reg_port}";
done
```

Watch kubernetes node status until its ready:
```bash
kubectl get node -w
```

Then install ingress controller ([ingress-nginx](https://kind.sigs.k8s.io/docs/user/ingress/#ingress-nginx)):
```bash
#!/bin/sh

# install nginx ingerss
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/static/provider/kind/deploy.yaml
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
```


## Verify Cluster Installation

Deploy example app:

```bash
#!/bin/sh

kubectl apply -f https://kind.sigs.k8s.io/examples/ingress/usage.yaml
kubectl wait pod \
  -l app=foo \
  --for=condition=ready \
  --timeout=90s
```

Check if it works:
```bash
# port 8080 defined in extraPortMappings
# should output "foo"
curl localhost:8080/foo
# should output "bar"
curl localhost:8080/bar
```

Clean up:
```bash
kubectl delete -f https://kind.sigs.k8s.io/examples/ingress/usage.yaml
```


## Delete Local Kubernetes Cluster
```bash
kind delete cluster
```
Delete local docker registry created by `kind`:
```bash
docker rm -f kind-registry
```